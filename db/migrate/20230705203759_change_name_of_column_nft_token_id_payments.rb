class ChangeNameOfColumnNftTokenIdPayments < ActiveRecord::Migration[7.0]
  def change
    change_table :payments do |t|
      t.rename :nft_token_id, :nftTokenId
    end
  end
end
