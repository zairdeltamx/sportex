class AddRememberCreatedAtToUsers < ActiveRecord::Migration[7.0]
  def change
    return if column_exists?(:users, :remember_created_at)

    add_column :users, :remember_created_at, :datetime
  end
end
