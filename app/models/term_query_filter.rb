class TermQueryFilter < ActiveRecord::Base
  belongs_to :term_query
  validates_presence_of :term_query
  validates_presence_of :pred_uri
  validates_presence_of :op
  validates_presence_of :obj_uri, :if => :object_term?
  validates_presence_of :num_val1, :if => :numeric?
  validates_presence_of :units_uri, :if => :numeric?
  validates_presence_of :num_val2, :if => :range?

  enum :op => {
    :is_any => 0,
    :is_obj => 1,
    :eq => 2,
    :gt => 3,
    :lt => 4,
    :range => 5
  }

  def predicate?
    is_any?
  end

  def object_term?
    is_obj?
  end

  def numeric?
    eq? || gt? || lt? || range?
  end

  def valid_ops
    ops = [:is_any]
    
    if pred_uri
      ops << :is_obj if TraitBank::Terms.obj_terms_for_pred(pred_uri).any?
      ops += [
        :eq,
        :lt,
        :gt,
        :range
      ] if TraitBank::Terms.unit_term_for_pred(pred_uri)
    end

    ops
  end
end
