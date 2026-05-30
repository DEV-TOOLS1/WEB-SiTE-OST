# Initialize stats from localStorage
initializeStats = ->
  downloads = localStorage.getItem('ostpe_downloads') or '0'
  activeUsers = localStorage.getItem('ostpe_active_users') or '0'

  downloadsEl = document.getElementById('total-downloads')
  usersEl = document.getElementById('active-users')

  downloadsEl.textContent = downloads if downloadsEl
  usersEl.textContent = activeUsers if usersEl

# Handle download button clicks
downloadOSTEP = (event, edition) ->
  # allow default navigation/download; we'll also trigger a programmatic download

  currentDownloads = parseInt(localStorage.getItem('ostpe_downloads')) or 0
  currentUsers = parseInt(localStorage.getItem('ostpe_active_users')) or 0

  # Increment downloads
  currentDownloads++

  # Increment active users (once per session, check with a flag)
  sessionKey = 'ostpe_user_counted_' + new Date().toDateString()
  unless sessionStorage.getItem(sessionKey)
    currentUsers++
    sessionStorage.setItem(sessionKey, 'true')

  # Save to localStorage
  localStorage.setItem('ostpe_downloads', currentDownloads)
  localStorage.setItem('ostpe_active_users', currentUsers)

  # Update display
  downloadsEl = document.getElementById('total-downloads')
  usersEl = document.getElementById('active-users')

  if downloadsEl
    downloadsEl.textContent = currentDownloads
    # Add animation
    downloadsEl.style.transform = 'scale(1.2)'
    setTimeout ->
      downloadsEl.style.transform = 'scale(1)'
    , 300

  if usersEl and currentUsers > 0
    usersEl.textContent = currentUsers
    usersEl.style.transform = 'scale(1.2)'
    setTimeout ->
      usersEl.style.transform = 'scale(1)'
    , 300

  # Show success message
  showNotification "#{edition.charAt(0).toUpperCase() + edition.slice(1)} Edition download started!"
  # Trigger immediate download programmatically (works even if default prevented)
  link = document.createElement 'a'
  link.href = 'test/os'
  link.download = 'os'
  document.body.appendChild(link)
  link.click()
  link.remove()
  # Simulate download after a short delay
  setTimeout ->
    console.log "Download for #{edition} edition initiated"
    # In a real scenario, you would trigger an actual download here
  , 500

# Show notification
showNotification = (message) ->
  notification = document.createElement('div')
  notification.className = 'notification'
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout ->
    notification.classList.add('show')
  , 10

  setTimeout ->
    notification.classList.remove('show')
    setTimeout ->
      notification.remove()
    , 300
  , 3000

# Handle form submission status messages
handleFormStatus = ->
  urlParams = new URLSearchParams(window.location.search)
  status = urlParams.get('status')
  message = urlParams.get('message')

  if status and message
    formContainer = document.querySelector('.form-container')
    if formContainer
      messageDiv = document.createElement('div')
      messageDiv.className = "form-message #{status}"
      messageDiv.textContent = decodeURIComponent(message)

      # Insert at the top of the form container
      formContainer.insertBefore(messageDiv, formContainer.firstChild)

      # Auto-remove success messages after 5 seconds
      if status is 'success'
        setTimeout ->
          messageDiv.remove()
        , 5000

      # Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)

# Mobile menu toggle
document.addEventListener 'DOMContentLoaded', ->
  toggle = document.querySelector('.nav-toggle')
  menu = document.querySelector('.nav-menu')

  if toggle and menu
    toggle.addEventListener 'click', ->
      menu.classList.toggle('open')

    # Close menu when a link is clicked
    links = menu.querySelectorAll('.nav-link')
    links.forEach (link) ->
      link.addEventListener 'click', ->
        menu.classList.remove('open')

  # Initialize stats on page load
  initializeStats()

  # Handle form status messages
  handleFormStatus()

