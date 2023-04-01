class AddAttackDefenseStrengthToNfts < ActiveRecord::Migration[7.0]
  def change
    add_column :nfts, :attack, :float
    add_column :nfts, :defense, :float
    add_column :nfts, :strength, :float
  end
end
