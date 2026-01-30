Jekyll::Hooks.register [:posts, :pages, :documents], :post_render do |doc|
  # Only process HTML output
  if doc.output_ext == ".html"
    doc.output.gsub!(/<a\s+([^>]*href=["'])(https?:\/\/(?!danielphayward\.com)[^"'?#]+)([^"']*)(["'][^>]*)>/i) do |match|
      before = $1
      url = $2
      after_url = $3
      rest = $4
      
      # Add UTM parameter
      separator = after_url.include?('?') ? '&' : '?'
      utm_param = "#{separator}utm_source=danielphayward.com"
      
      # Reconstruct the link
      "<a #{before}#{url}#{after_url}#{utm_param}#{rest}>"
    end
  end
end