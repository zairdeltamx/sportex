class CreateNfts < ActiveRecord::Migration[7.0]
  def change
    create_table :nfts do |t|
      t.float :price
      t.integer :tokenId
      t.string :seller
      t.string :owner
      t.string :image
      t.string :name
      t.float :attack
      t.float :defense
      t.float :strength
      t.string :description
      t.json :meta
      # t.json :meta_json

      t.timestamps
    end
  end
end
