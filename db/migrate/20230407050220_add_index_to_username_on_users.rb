class AddIndexToUsernameOnUsers < ActiveRecord::Migration[7.0]
  def change
    add_index :users, :username, unique: true
    add_index :users, :eth_address, unique: true
    add_index :users, :eth_nonce, unique: true
  end
end
