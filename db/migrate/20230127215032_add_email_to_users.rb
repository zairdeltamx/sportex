class AddEmailToUsers < ActiveRecord::Migration[7.0]
  def change
    return if column_exists?(:users, :email)

    add_column :users, :email, :string
  end
end
