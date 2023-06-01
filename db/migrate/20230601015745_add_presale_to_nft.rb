class AddPresaleToNft < ActiveRecord::Migration[7.0]
  def change
    add_column :nfts, :presale, :boolean, default: true
  end
end
