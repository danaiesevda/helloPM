# Testing Welcome Modal

## To see the welcome modal again:

1. Open browser console (F12 or Cmd+Option+I)
2. Run this command:
   ```javascript
   localStorage.removeItem('hellopm-welcome-seen')
   ```
3. Refresh the page

## Or add this to your browser console to force show it:
```javascript
localStorage.removeItem('hellopm-welcome-seen')
location.reload()
```

## Check if the key exists:
```javascript
localStorage.getItem('hellopm-welcome-seen')
```
