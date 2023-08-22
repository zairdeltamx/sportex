class RemoveNewEmailFromUsers < ActiveRecord::Migration[7.0]
  def up
    User.update_all('email = new_email')

    remove_column :users, :new_email, :string
  end

  def down
    remove_column :users, :email
  end
end
