class RemoveRememberCreatedAtFromUsers < ActiveRecord::Migration[7.0]
  def change
    return unless column_exists?(:users, :remember_created_at)

    remove_column :users, :remember_created_at
  end
end
