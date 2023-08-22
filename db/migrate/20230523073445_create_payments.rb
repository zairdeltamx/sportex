class CreatePayments < ActiveRecord::Migration[7.0]
  def change
    create_table :payments do |t|
      t.integer :nft_token_id
      t.string :ticket_id
      t.string :buyer_address
      t.decimal :amount_paid

      t.timestamps
    end
  end
end
