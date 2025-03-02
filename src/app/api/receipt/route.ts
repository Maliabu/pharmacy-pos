/* eslint-disable @typescript-eslint/no-unused-vars */
import puppeteer, {Page, type Browser} from 'puppeteer';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import chromium from '@sparticuz/chromium-min';
import puppeteerCore, { type Browser as BrowserCore } from 'puppeteer-core';


export async function POST(req: NextRequest) {
  try {
    const { htmlContent }: { htmlContent: string } = await req.json();  // Parsing the HTML content sent in the request

    // Read the content of your local global.css file
    const globalCssPath = path.resolve(process.cwd(), 'src/app/globals.css');
    const globalCssContent = fs.readFileSync(globalCssPath, 'utf-8'); // Read the CSS file as a string

    // Add TailwindCSS via CDN to the HTML content
    const fullHtmlContent = `
      <!DOCTYPE html>
      <html lang="en">
          <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Invoice</title>
          <!-- Include TailwindCSS from CDN -->
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.0.3/dist/tailwind.min.css" rel="stylesheet" />
          <!-- Include Tailwind Animate via CDN -->
          <link href="https://cdn.jsdelivr.net/npm/tailwind-animate@3.0.0/dist/index.min.css" rel="stylesheet" />
          <!-- Include Tailwind Merge if needed -->
          <script src="https://cdn.jsdelivr.net/npm/tailwind-merge@1.0.0/dist/index.umd.min.js"></script>
          </head>
          <body>
          <div style="text-align: center;">
          <img src="http://localhost:3000/black.png" alt="logo" style="width: 200px; height: auto; display: inline-block;"/>
          </div>
          ${htmlContent}
          </body>
      </html>
    `;

    // Launch a headless browser instance using Puppeteer
    // const browser = await puppeteer.launch({
    //   executablePath: process.env.CHROMIUM_PATH, // Use the path from environment variable if available
    //   headless: true,
    //   args: ['--no-sandbox', '--disable-setuid-sandbox']
    // });
    let browser: Browser | BrowserCore;
        if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
            // Configure the version based on your package.json (for your future usage).
            const executablePath = await chromium.executablePath('https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar')
            browser = await puppeteerCore.launch({
                executablePath,
                // You can pass other configs as required
                args: chromium.args,
                headless: (() => {
                  const headlessValue = chromium.headless;
      
                  // Check if headlessValue is a string or boolean and act accordingly
                  if (typeof headlessValue === 'boolean') {
                      return headlessValue;
                  }
      
                  if (typeof headlessValue === 'string') {
                      // If it's a string, handle different possible string values
                      if (headlessValue === 'true') {
                          return true;
                      } else if (headlessValue === 'false') {
                          return false;
                      } else if (headlessValue === 'shell') {
                          return 'shell';  // If you want to handle the "shell" case explicitly
                      }
                  }
      
                  // Default to undefined or headless mode as desired
                  return undefined;
              })(),
                defaultViewport: chromium.defaultViewport
            })
        } else {
            browser = await puppeteer.launch({
                executablePath: process.env.CHROMIUM_PATH, // Use the path from environment variable if available
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            })
        }
    const page = await browser.newPage();
    await page.setViewport({
        width: 320,  // 80mm in pixels (assuming 96 DPI, adjust as needed)
        height: 700, // Set a height that's appropriate for your content
    });

    // Set the HTML content on the page
    await page.setContent(fullHtmlContent, { waitUntil: 'load' });
    // Measure the height of the content
    const contentHeight = await (page as Page).evaluate(() => {
      const content = document.querySelector('.content');
      if (content) {
        return (content as HTMLElement).offsetHeight;  // Cast to HTMLElement to access offsetHeight
      }
      return 0;  // Return 0 if the element is not found
    });

    // Inject the global.css content directly as a style tag into the page
    await page.addStyleTag({ content: globalCssContent });
    await page.setRequestInterception(true);
      page.on('request', (req) => {
        if (req.resourceType() === 'image') {
          req.continue();  // Allow image requests to load
        } else {
          req.continue();
        }
      });
    
      // await page.goto("http://localhost:3000/dashboard/order")

    // Wait for the body to be rendered and styles to be applied
    await page.waitForSelector('img', { visible: true }); // Ensure body is rendered

    // Check the content of the page to see if the styles have been applied
    await page.content();

    // Optionally, take a screenshot for debugging

    // Generate the PDF
    const pdfBuffer = await page.pdf({
    //   format: 'A4',
      printBackground: true,
      width: '80mm',
      // height: '150mm', // Let Puppeteer calculate the height based on content
    });

    // Close the browser instance
    await browser.close();

    // Return the PDF as a response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=receipt.pdf',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
