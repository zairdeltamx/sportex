class AddTeamNameToNfts < ActiveRecord::Migration[7.0]
  def change
    return if column_exists?(:nfts, :teamName)

    add_column :nfts, :teamName, :string
  end
end
