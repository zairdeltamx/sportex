class ChangeNameOfColumnBuyerAddressPayments < ActiveRecord::Migration[7.0]
  def change
    change_table :payments do |t|
      t.rename :buyer_address, :buyerAddress
    end
  end
end
