// Function to convert a base64 image to a blob
export const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};

// Function to trigger download of an image
export const downloadImage = (dataURL: string, filename: string = "photobooth-strip.png"): void => {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Function to apply vintage effect to an image
const applyVintageTint = async (dataUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Apply vintage tint overlay
      ctx.fillStyle = 'rgba(255, 222, 173, 0.3)'; // Warm vintage tint
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add slight vignette effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.height * 0.3,
        canvas.width / 2,
        canvas.height / 2,
        canvas.height * 0.7
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.3)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = dataUrl;
  });
};

// Function to generate a photo strip from multiple images
export const generatePhotoStrip = async (photos: string[], vertical: boolean = true): Promise<string> => {
  return new Promise(async (resolve) => {
    const loadedImages: HTMLImageElement[] = [];
    const processedPhotos: string[] = [];
    let loadedCount = 0;
    
    // First, apply vintage effect to all photos
    for (const photoSrc of photos) {
      const vintagePhoto = await applyVintageTint(photoSrc);
      processedPhotos.push(vintagePhoto);
    }
    
    // Then load all processed photos
    processedPhotos.forEach((photoSrc, index) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        loadedImages[index] = img;
        loadedCount++;
        
        if (loadedCount === photos.length) {
          const photoWidth = loadedImages[0].width;
          const photoHeight = loadedImages[0].height;
          const spacing = 40; // Increased spacing between photos
          const borderWidth = 30; // White border width
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          
          if (vertical) {
            canvas.width = photoWidth + (borderWidth * 2);
            canvas.height = (photoHeight * photos.length) + (spacing * (photos.length - 1)) + (borderWidth * 2);
            
            // Fill white background (acts as border)
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            loadedImages.forEach((img, i) => {
              // Draw each photo with proper spacing
              ctx.drawImage(
                img,
                borderWidth,
                borderWidth + (i * (photoHeight + spacing)),
                photoWidth,
                photoHeight
              );
            });
          } else {
            canvas.width = (photoWidth * photos.length) + (spacing * (photos.length - 1)) + (borderWidth * 2);
            canvas.height = photoHeight + (borderWidth * 2);
            
            // Fill white background (acts as border)
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            loadedImages.forEach((img, i) => {
              ctx.drawImage(
                img,
                borderWidth + (i * (photoWidth + spacing)),
                borderWidth,
                photoWidth,
                photoHeight
              );
            });
          }
          
          // Add subtle shadow effect
          ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
          ctx.shadowBlur = 15;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          
          resolve(canvas.toDataURL('image/png'));
        }
      };
      img.src = photoSrc;
    });
  });
};

// Resize an image to specified dimensions
export const resizeImage = (dataURL: string, maxWidth: number = 800, maxHeight: number = 600): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      // Calculate the new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      
      // Create canvas with new dimensions
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      // Draw image on canvas with new dimensions
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert canvas to data URL and resolve
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = dataURL;
  });
};
