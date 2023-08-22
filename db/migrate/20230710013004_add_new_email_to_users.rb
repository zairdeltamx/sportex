class AddNewEmailToUsers < ActiveRecord::Migration[7.0]
  def up
    add_column :users, :new_email, :string

    User.update_all('new_email = email')
  end

  def down
    remove_column :users, :new_email
  end
end
