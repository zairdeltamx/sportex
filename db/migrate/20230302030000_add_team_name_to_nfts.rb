class AddTeamNameToNfts < ActiveRecord::Migration[7.0]
  def change
    add_column :nfts, :teamName, :string
  end
end
