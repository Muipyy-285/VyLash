# Snap Camera Kit Setup Guide

This guide will help you set up Snap Camera Kit for the VyLash AR try-on feature.

## Prerequisites

- A Snap account
- Internet connection
- Camera permissions on your device

## Step 1: Create a Snap Camera Kit Account

1. Visit the [Snap Camera Kit Portal](https://camera-kit.snapchat.com/)
2. Click "Get Started" or "Sign In"
3. Log in with your Snapchat account or create a new one
4. Accept the Camera Kit terms and conditions

## Step 2: Get Your API Token

1. Once logged in, navigate to the **Dashboard**
2. Click on **"Create App"** or select an existing app
3. Go to the **"API Token"** section
4. Copy your API token (it looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
5. **Keep this token secure** - it's your authentication key

## Step 3: Create or Upload a Lens

### Option A: Use an Existing Lens

If you already have a lens created in Lens Studio:

1. Open [Lens Studio](https://ar.snap.com/lens-studio)
2. Find your eyelash lens project
3. Go to **File → Publish Lens**
4. Follow the publishing wizard
5. Once published, you'll receive a **Lens ID** (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

### Option B: Create a New Lens

1. Download and install [Lens Studio](https://ar.snap.com/lens-studio)
2. Start a new project using the **"Face Effects"** template
3. Import your eyelash assets
4. Position the lashes using the Face Mesh
5. Test the lens in Lens Studio
6. Publish the lens to get a Lens ID

**Note**: The Lens ID from your HTML example is: `ac20f4e5-609d-433e-aa7e-48d89a7cdac6`

## Step 4: Configure Your Environment

1. Open the `.env` file in the root of the VyLash project
2. Add your credentials:

```env
VITE_SNAP_API_TOKEN=your_actual_api_token_here
VITE_SNAP_LENS_ID=ac20f4e5-609d-433e-aa7e-48d89a7cdac6
```

3. Save the file

**Example:**
```env
VITE_SNAP_API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U
VITE_SNAP_LENS_ID=ac20f4e5-609d-433e-aa7e-48d89a7cdac6
```

## Step 5: Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the **Virtual Try-On** page (`/try-on`)

3. Click the **"Snap AR"** mode button

4. Allow camera permissions when prompted

5. You should see the Snap AR filter loading

## Troubleshooting

### Error: "VITE_SNAP_API_TOKEN is not set"

**Solution**: Make sure your `.env` file exists and contains the API token:
- Check that `.env` is in the root directory (same level as `package.json`)
- Restart your development server after editing `.env`
- Ensure there are no extra spaces or quotes around the values

### Error: "Failed to load lens"

**Possible causes**:
- Invalid Lens ID
- Lens not published or not public
- API token doesn't have access to this lens

**Solution**:
- Verify your Lens ID is correct
- Check lens status in Lens Studio or Snap Portal
- Ensure the lens is published and accessible

### Error: "Camera access denied"

**Solution**: 
- Allow camera permissions in your browser
- Check browser settings: Settings → Privacy → Camera
- Try using HTTPS (required for camera access on some browsers)

### Camera shows but no AR effect

**Possible causes**:
- Lens not properly applied
- Network issues preventing lens download
- Incompatible browser

**Solution**:
- Check browser console for error messages
- Ensure stable internet connection
- Try Chrome or Firefox (recommended browsers)

## Browser Compatibility

Snap Camera Kit works best on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Security Notes

- ⚠️ **Never commit your `.env` file** - it's already in `.gitignore`
- ⚠️ **Don't share your API token publicly**
- ⚠️ Keep your API credentials secure
- ⚠️ Regenerate tokens if compromised

## Additional Resources

- [Snap Camera Kit Documentation](https://docs.snap.com/camera-kit/home)
- [Lens Studio Tutorials](https://ar.snap.com/learn/lens-studio)
- [Camera Kit Web SDK Reference](https://docs.snap.com/camera-kit/integrate-sdk/web/tutorials/quick-start)

## Support

If you encounter issues not covered in this guide:

1. Check the [Snap Camera Kit FAQ](https://docs.snap.com/camera-kit/faq)
2. Visit the [Snap Developer Forum](https://community.snap.com/)
3. Review browser console logs for specific error messages
