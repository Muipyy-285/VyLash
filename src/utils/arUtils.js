// Indices for upper eyelids to place lashes
// These are approximate standard FaceMesh indices
export const LEFT_EYE_UPPER = [161, 160, 159, 158, 157, 173, 133];
export const RIGHT_EYE_UPPER = [362, 398, 384, 385, 386, 387, 263]; // 263 is outer corner

// Draw Landmarks Debug Function - Shows full face mesh
export const drawLandmarks = (ctx, landmarks) => {
    if (!landmarks) return;

    // Draw all landmarks as small dots
    ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
    for (let i = 0; i < landmarks.length; i++) {
        const pt = landmarks[i];
        if (!pt) continue;
        const x = pt.x * ctx.canvas.width;
        const y = pt.y * ctx.canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Draw connections for face mesh (simplified face outline and features)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;

    // Helper function to draw a line between two landmark indices
    const drawLine = (i1, i2) => {
        const pt1 = landmarks[i1];
        const pt2 = landmarks[i2];
        if (!pt1 || !pt2) return;
        ctx.beginPath();
        ctx.moveTo(pt1.x * ctx.canvas.width, pt1.y * ctx.canvas.height);
        ctx.lineTo(pt2.x * ctx.canvas.width, pt2.y * ctx.canvas.height);
        ctx.stroke();
    };

    // Draw eye contours (highlighted)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
    ctx.lineWidth = 2;

    // Left eye upper lid
    const leftEyeUpper = [33, 246, 161, 160, 159, 158, 157, 173, 133];
    for (let i = 0; i < leftEyeUpper.length - 1; i++) {
        drawLine(leftEyeUpper[i], leftEyeUpper[i + 1]);
    }

    // Right eye upper lid
    const rightEyeUpper = [263, 466, 388, 387, 386, 385, 384, 398, 362];
    for (let i = 0; i < rightEyeUpper.length - 1; i++) {
        drawLine(rightEyeUpper[i], rightEyeUpper[i + 1]);
    }

    // Draw key reference points in bright colors
    const drawPoint = (index, color) => {
        const pt = landmarks[index];
        if (!pt) return;
        const x = pt.x * ctx.canvas.width;
        const y = pt.y * ctx.canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.stroke();
    };

    // Draw key landmarks for verification
    drawPoint(159, '#00FF00'); // L Top
    drawPoint(386, '#FF0000'); // R Top
    drawPoint(133, '#FFFF00'); // L Inner
    drawPoint(33, '#FFFF00'); // L Outer
    drawPoint(362, '#00FFFF'); // R Inner
    drawPoint(263, '#00FFFF'); // R Outer
};

// ฟังก์ชันวางขนตา VyLash - Optimized Rendering
export const drawLashes = (ctx, landmarks, lashImage) => {
    if (!landmarks || !lashImage) return;

    // 1. ระบุจุดพิกัดดวงตาจาก MediaPipe Face Mesh
    const EYE_POINTS = {
        left: { top: 159, inner: 133, outer: 33 },
        right: { top: 386, inner: 362, outer: 263 }
    };

    const render = (points, isLeft) => {
        const top = landmarks[points.top];
        const inner = landmarks[points.inner];
        const outer = landmarks[points.outer];

        if (!top || !inner || !outer) return;

        // 2. คำนวณองศาเอียงตามจริง (Real-time Rotation)
        const angle = Math.atan2(
            (inner.y - outer.y) * ctx.canvas.height,
            (inner.x - outer.x) * ctx.canvas.width
        );

        // 3. คำนวณขนาดตามระยะห่างของใบหน้า (Scaling)
        const eyeWidth = Math.sqrt(
            Math.pow((inner.x - outer.x) * ctx.canvas.width, 2) +
            Math.pow((inner.y - outer.y) * ctx.canvas.height, 2)
        ) * 1.45;
        const eyeHeight = eyeWidth * 0.6;

        ctx.save();

        // === REALISTIC RENDERING ENHANCEMENTS ===

        // Enable image smoothing for softer edges
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Set opacity for more natural blending (0.85 = 85% opacity)
        ctx.globalAlpha = 0.85;

        // Use multiply blend mode to blend with skin tone
        // This makes lashes appear more natural against the eyelid
        ctx.globalCompositeOperation = 'multiply';

        // 3. ปรับตำแหน่ง Anchor
        const offsetY = 15;
        ctx.translate(inner.x * ctx.canvas.width, (inner.y * ctx.canvas.height) + offsetY);

        // 4. สั่งหมุนตามหน้า
        ctx.rotate(isLeft ? angle : angle + Math.PI);

        // 5. Flip Vertical ให้ขนตางอนขึ้น
        ctx.scale(1, -1);

        // === DRAW SHADOW FIRST (for depth) ===
        ctx.save();
        ctx.globalAlpha = 0.2; // Subtle shadow
        ctx.globalCompositeOperation = 'multiply';
        const shadowOffset = 2;

        const sx = isLeft ? 0 : lashImage.width / 2;
        const xPos = isLeft ? -eyeWidth : 0;

        // Draw shadow slightly offset
        ctx.drawImage(
            lashImage,
            sx, 0, lashImage.width / 2, lashImage.height,
            xPos + shadowOffset, shadowOffset, eyeWidth, eyeHeight
        );
        ctx.restore();

        // === DRAW MAIN LASH ===
        ctx.globalAlpha = 0.85;
        ctx.globalCompositeOperation = 'multiply';

        ctx.drawImage(
            lashImage,
            sx, 0, lashImage.width / 2, lashImage.height,
            xPos, 0, eyeWidth, eyeHeight
        );

        // === ADD HIGHLIGHT FOR DEPTH ===
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.globalCompositeOperation = 'screen'; // Brightening effect
        ctx.drawImage(
            lashImage,
            sx, 0, lashImage.width / 2, lashImage.height,
            xPos - 1, -1, eyeWidth, eyeHeight
        );
        ctx.restore();

        ctx.restore();
    };

    render(EYE_POINTS.left, true);  // วาดข้างซ้าย
    render(EYE_POINTS.right, false); // วาดข้างขวา
};
