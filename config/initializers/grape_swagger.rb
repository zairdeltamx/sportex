GrapeSwaggerRails.options.url = '/v1/api-docs'
GrapeSwaggerRails.options.app_url = Settings.api_docs_url
GrapeSwaggerRails.options.app_name = Settings.api_docs_name
GrapeSwaggerRails.options.before_filter do |request|
  #if ActiveRecord::Base.connection.table_exists?('users') && user = User.find_by_email('api_test_user@stricct.com')
  #GrapeSwaggerRails.options.headers['AUTHORIZATION'] = user.auth_token
  #end
end
