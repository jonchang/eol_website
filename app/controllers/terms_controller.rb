class TermsController < ApplicationController
  helper :data
  protect_from_forgery except: :clade_filter
  before_action :search_setup, :only => [:search, :search_form, :show]

  def index
    @count = TraitBank::Terms.count
    glossary("full_glossary")
  end

  def search
    respond_to do |fmt|
      fmt.html do
        if params[:term_query]
          @query = TermQuery.new(tq_params)
          search_common
        else
          @query = TermQuery.new
          @query.pairs.build
        end
      end

      fmt.csv do
        if !current_user
          redirect_to new_user_session_path
        else
          @query = TermQuery.new(tq_params)

          if @query.search_pairs.empty?
            flash_and_redirect_no_format(t("user_download.you_must_select"))
          else
            data = TraitBank::DataDownload.term_search(@query, current_user.id)

            if data.is_a?(UserDownload)
              flash_and_redirect_no_format(t("user_download.created", url: user_path(current_user)))
            else
              send_data data
            end
          end
        end
      end
    end
  end

  def search_form
    @query = TermQuery.new(tq_params)
    @query.pairs.build if params[:add_pair]
    @query.remove_pair(params[:remove_pair].to_i) if params[:remove_pair]
    render :layout => false
  end

  def show
    @query = TermQuery.new({
      :pairs => [TermQueryPair.new(
        :predicate => params[:uri]
      )]
    })
    search_common
  end

  def edit
    @term = TraitBank.term_as_hash(params[:uri])
  end

  def update
    # TODO: security check: admin only
    term = params[:term].merge(uri: params[:uri])
    # TODO: sections ...  I can't properly test that right now.
    TraitBank.update_term(term) # NOTE: *NOT* hash!
    redirect_to(term_path(term[:uri]))
  end

  def predicate_glossary
    @count = TraitBank::Terms.predicate_glossary_count
    glossary(params[:action])
  end

  # We ultimately don't want to just pass a "URI" to the term search; we need to
  # separate object terms and predicates. We handle that here, since there are
  # two places where it matters.
  def add_uri_to_options(options)
    if @object
      options[:predicate] = @and_predicate && @and_predicate[:uri]
      options[:object_term] = @and_object ?
        [@term[:uri], @and_object[:uri]] :
        @term[:uri]
    else
      options[:predicate] = @and_predicate ?
        [@term[:uri], @and_predicate[:uri]] :
        @term[:uri]
      options[:object_term] = @and_object && @and_object[:uri]
    end
  end

  def object_term_glossary
    @count = TraitBank::Terms.object_term_glossary_count
    glossary(params[:action])
  end

  def units_glossary
    @count = TraitBank::Terms.units_glossary_count
    glossary(params[:action])
  end

private
  def paginate_term_search_data(data, query)
    options = {
      :count => true,
      :result_type => @result_type
    }
    @count = TraitBank.term_search(query, options)
    #@count = 1000
    @grouped_data = Kaminari.paginate_array(data, total_count: @count).
      page(@page).per(@per_page)
  end

  def paginate_data(data)
    options = { clade: params[:clade], count: true }
    add_uri_to_options(options)
    TraitBank.term_search(options)
    @grouped_data = Kaminari.paginate_array(data, total_count: @count).
      page(@page).per(@per_page)
  end

  def glossary(which)
    @glossary = glossary_helper(which, true)

    respond_to do |fmt|
      fmt.html {}
      fmt.json { render json: @glossary }
    end
  end

  def glossary_helper(which, paginate)
    @per_page = params[:per_page] || Rails.configuration.data_glossary_page_size
    @page = params[:page] || 1
    query = params[:query]
    @per_page = 10 if query
    if params[:reindex] && is_admin?
      TraitBank::Admin.clear_caches
      lim = (@count / @per_page.to_f).ceil
      (0..lim+10).each do |index|
        expire_fragment("term/glossary/#{index}")
      end
    end
    result = TraitBank::Terms.send(which, @page, @per_page, query)

    if paginate
      result = Kaminari.paginate_array(result, total_count: @count).
      page(@page).per(@per_page)
    end

    result
  end

  def get_associations
    @associations =
      begin
        ids = @grouped_data.map { |t| t[:object_page_id] }.compact.sort.uniq
        Page.where(id: ids).
          includes(:medium, :preferred_vernaculars, native_node: [:rank])
      end
  end

  def tq_params
    params.require(:term_query).permit(
      :clade,
      :pairs_attributes => [
        :predicate,
        :object
      ]
    )
  end

  def search_setup
    @predicate_options = [['----', nil]] +
      TraitBank::Terms.predicate_glossary.collect { |item| [item[:name], item[:uri]] }
    @result_type = params[:result_type]&.to_sym || :record
  end

  def search_common
    @page = params[:page] || 1
    @per_page = 50
    data = TraitBank.term_search(@query, {
      :page => @page,
      :per => @per_page,
      :result_type => @result_type
    })
    ids = data.map { |t| t[:page_id] }.uniq
    pages = Page.where(:id => ids).includes(:medium, :native_node, :preferred_vernaculars)
    @pages = {}

    ids.each do |id|
      page = pages.find { |p| p.id == id }
      @pages[id] = page if page
    end

    paginate_term_search_data(data, @query)
    @is_terms_search = true
    @resources = TraitBank.resources(data)
    @associations = get_associations(data)
    render "search"
  end

  # TODO: Schnarfed this (mostly) from the pages_controller; we should generalize as a helper.
  def get_associations(data)
    @associations =
      begin
        # TODO: this pattern (from #map to #uniq) is repeated three times in the code, suggests extraction:
        ids = data.map { |t| t[:object_page_id] }.compact.sort.uniq
        Page.where(id: ids).includes(:medium, :preferred_vernaculars, native_node: [:rank])
      end
  end

  def flash_and_redirect_no_format(msg)
    flash[:notice] = msg
    loc = params
    loc.delete(:format)
    redirect_to term_search_path(params)
  end
end
