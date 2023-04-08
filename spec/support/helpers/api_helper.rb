module ApiHelper
  def json_response
    @json ||= JSON.parse(last_response.body)
  end
end
