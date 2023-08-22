class ChangeNameOfColumnTicketIdPayments < ActiveRecord::Migration[7.0]
  def change
    change_table :payments do |t|
      t.rename :ticket_id, :stripeChargeId
    end
  end
end
