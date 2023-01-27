class RemoveMetaJsonFromNfts < ActiveRecord::Migration[7.0]
  def change
    remove_column :nfts, :meta_json, :string
  end
end
