class ChangeNameOfColumnAmountPaidPayments < ActiveRecord::Migration[7.0]
  def change
    change_table :payments do |t|
      t.rename :amount_paid, :amount
    end
  end
end
