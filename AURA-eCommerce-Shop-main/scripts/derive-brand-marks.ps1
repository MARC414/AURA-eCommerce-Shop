# Derive transparent OPAR emblem PNGs from the supplied JPG.
#
# Why: the supplied file (opar-seed-orbit.jpg) paints the cream Seed + Orbit
# mark on a solid #003926 plate. That plate is not in the palette, so it reads
# as a coloured sticker on the ground and on the paper.
#
# Method: the source is two-tone, so every pixel is a blend of plate and mark.
# Project each pixel onto the plate->mark axis to recover its true coverage
# (alpha), then re-ink that alpha in the colour the ground needs. This is an
# un-matte, not a colour key: no dark fringe, no halo, clean at any size.
#
# Geometry is untouched. Only ink colour changes, which is the normal treatment
# for a one-colour mark. The final vector SVG is still the owner's to supply.
#
# Usage:  powershell -File scripts/derive-brand-marks.ps1 [-Source <jpg>]

param(
  [string]$Source = (Join-Path $PSScriptRoot '..\public\assets\brand\opar-seed-orbit.jpg'),
  [string]$OutDir = (Join-Path $PSScriptRoot '..\public\assets\brand')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$code = @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class OparMarkBuilder
{
    static byte[] Hex(string hex)
    {
        hex = hex.TrimStart('#');
        return new byte[] {
            Convert.ToByte(hex.Substring(0, 2), 16),
            Convert.ToByte(hex.Substring(2, 2), 16),
            Convert.ToByte(hex.Substring(4, 2), 16)
        };
    }

    public static string Run(string src, string outDark, string outLight, string outTile, string plateHex, string creamHex, float floor)
    {
        using (var b = new Bitmap(src))
        {
            int w = b.Width, h = b.Height;
            var rect = new Rectangle(0, 0, w, h);
            var data = b.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            var buf = new byte[data.Stride * h];
            Marshal.Copy(data.Scan0, buf, 0, buf.Length);
            b.UnlockBits(data);

            byte[] P = Hex(plateHex), C = Hex(creamHex);
            double dr = C[0] - P[0], dg = C[1] - P[1], db = C[2] - P[2];
            double dd = dr * dr + dg * dg + db * db;

            float[] alpha = new float[w * h];
            int minX = w, minY = h, maxX = -1, maxY = -1;

            for (int y = 0; y < h; y++)
            {
                int row = y * data.Stride;
                for (int x = 0; x < w; x++)
                {
                    int i = row + x * 4;
                    double pr = buf[i + 2] - P[0], pg = buf[i + 1] - P[1], pb = buf[i] - P[2];
                    double t = (pr * dr + pg * dg + pb * db) / dd;
                    if (t < 0) t = 0; else if (t > 1) t = 1;
                    // floor kills JPEG noise in the flat plate without thinning edges
                    float a = (t <= floor) ? 0f : (float)((t - floor) / (1f - floor));
                    alpha[y * w + x] = a;
                    if (a > 0.5f)
                    {
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            if (maxX < 0) throw new Exception("No mark pixels found; check the plate/cream colours.");

            int cw = maxX - minX + 1, ch = maxY - minY + 1;
            int side = (int)Math.Ceiling(Math.Max(cw, ch) * 1.2); // ~10% optical padding
            int cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
            int x0 = Math.Max(0, Math.Min(w - side, cx - side / 2));
            int y0 = Math.Max(0, Math.Min(h - side, cy - side / 2));

            Write(alpha, w, side, x0, y0, Hex("#F4F2EE"), outDark);  // Main Text for the ground
            Write(alpha, w, side, x0, y0, Hex("#2F332B"), outLight); // the ground, as ink on paper

            // App-icon tile: a container colour is correct here, unlike the old plate.
            Tile(alpha, w, side, x0, y0, Hex("#2F332B"), Hex("#F4F2EE"), 128, outTile);

            return string.Format("mark bbox x{0}-{1} y{2}-{3} ({4}x{5}); square {6}px at {7},{8}", minX, maxX, minY, maxY, cw, ch, side, x0, y0);
        }
    }

    static void Write(float[] alpha, int srcW, int side, int x0, int y0, byte[] ink, string path)
    {
        using (var o = new Bitmap(side, side, PixelFormat.Format32bppArgb))
        {
            var data = o.LockBits(new Rectangle(0, 0, side, side), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
            var buf = new byte[data.Stride * side];
            for (int y = 0; y < side; y++)
            {
                int row = y * data.Stride;
                for (int x = 0; x < side; x++)
                {
                    float a = alpha[(y0 + y) * srcW + (x0 + x)];
                    int i = row + x * 4;
                    buf[i] = ink[2]; buf[i + 1] = ink[1]; buf[i + 2] = ink[0];
                    buf[i + 3] = (byte)Math.Round(a * 255f);
                }
            }
            Marshal.Copy(buf, 0, data.Scan0, buf.Length);
            o.UnlockBits(data);
            o.Save(path, ImageFormat.Png);
        }
    }

    static void Tile(float[] alpha, int srcW, int side, int x0, int y0, byte[] bg, byte[] ink, int target, string path)
    {
        using (var o = new Bitmap(target, target, PixelFormat.Format32bppArgb))
        {
            var data = o.LockBits(new Rectangle(0, 0, target, target), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
            var buf = new byte[data.Stride * target];
            double scale = (double)side / target;
            for (int y = 0; y < target; y++)
            {
                int row = y * data.Stride;
                for (int x = 0; x < target; x++)
                {
                    int sx = x0 + Math.Min(side - 1, (int)(x * scale));
                    int sy = y0 + Math.Min(side - 1, (int)(y * scale));
                    float a = alpha[sy * srcW + sx];
                    int i = row + x * 4;
                    buf[i]     = (byte)Math.Round(bg[2] + (ink[2] - bg[2]) * a);
                    buf[i + 1] = (byte)Math.Round(bg[1] + (ink[1] - bg[1]) * a);
                    buf[i + 2] = (byte)Math.Round(bg[0] + (ink[0] - bg[0]) * a);
                    buf[i + 3] = 255;
                }
            }
            Marshal.Copy(buf, 0, data.Scan0, buf.Length);
            o.UnlockBits(data);
            o.Save(path, ImageFormat.Png);
        }
    }
}
'@

Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing

$info = [OparMarkBuilder]::Run(
  (Resolve-Path $Source).Path,
  (Join-Path $OutDir 'opar-seed-orbit-on-dark.png'),
  (Join-Path $OutDir 'opar-seed-orbit-on-light.png'),
  (Join-Path $OutDir 'opar-mark-tile-128.png'),
  '#003926',
  '#F5F0D0',
  0.08
)

Write-Output $info
Get-ChildItem (Join-Path $OutDir 'opar-seed-orbit-on-*.png'), (Join-Path $OutDir 'opar-mark-tile-128.png') |
  ForEach-Object { "{0}  {1:N0} bytes" -f $_.Name, $_.Length }
