
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

// Function to generate a photo strip from multiple images
export const generatePhotoStrip = async (photos: string[], vertical: boolean = true): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    
    // Create Image elements for each photo
    photos.forEach((photoSrc, index) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        loadedImages[index] = img;
        loadedCount++;
        
        // Once all images are loaded, render the strip
        if (loadedCount === photos.length) {
          const photoWidth = loadedImages[0].width;
          const photoHeight = loadedImages[0].height;
          
          if (vertical) {
            // Vertical strip layout
            canvas.width = photoWidth;
            canvas.height = photoHeight * photos.length + (photos.length - 1) * 10; // Add spacing
            
            loadedImages.forEach((img, i) => {
              ctx.drawImage(img, 0, i * (photoHeight + 10), photoWidth, photoHeight);
              // Add a small separator line except for the last image
              if (i < photos.length - 1) {
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, (i + 1) * photoHeight + i * 10 + 4);
                ctx.lineTo(photoWidth, (i + 1) * photoHeight + i * 10 + 4);
                ctx.stroke();
              }
            });
          } else {
            // Horizontal strip layout
            canvas.width = photoWidth * photos.length + (photos.length - 1) * 10; // Add spacing
            canvas.height = photoHeight;
            
            loadedImages.forEach((img, i) => {
              ctx.drawImage(img, i * (photoWidth + 10), 0, photoWidth, photoHeight);
              // Add a small separator line except for the last image
              if (i < photos.length - 1) {
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo((i + 1) * photoWidth + i * 10 + 4, 0);
                ctx.lineTo((i + 1) * photoWidth + i * 10 + 4, photoHeight);
                ctx.stroke();
              }
            });
          }
          
          // Add decorative frame
          ctx.strokeStyle = '#8B5CF6'; // Using our primary photobooth color
          ctx.lineWidth = 15;
          ctx.strokeRect(0, 0, canvas.width, canvas.height);
          
          // Convert canvas to data URL and resolve
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
