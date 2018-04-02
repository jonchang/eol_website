class AddPredUriToFilters < ActiveRecord::Migration
  def change
    add_column :term_query_numeric_filters, :pred_uri, :string
    add_column :term_query_range_filters, :pred_uri, :string
    add_column :term_query_object_term_filters, :pred_uri, :string
  end
end
