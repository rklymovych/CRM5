const IMAGES = {
    kadPointer_base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAEBklEQVRIx72Xy0vUURTH7/zU8f1+kAhBELQaENyooOOmVVAUQVEEQasWbYqCqJUEReGiTdEuCIKgZYHQUmSwldv+gEBRR8fX6Oho38/lnuGnWEnOdOHyszv3ns953XtOif39fWdzZ2fH5fN5t7Ky4ufa2pr/d7FYPLe3t3c1kUic1xyKoiipr2OGMaeZ0frnqqqqybGxsaz7y0hIoIcWCgUPWlpactls1q2vr7M2oD0TEpZOJpPOZk1NjRPEgzkvxbzSu7u7zLzOvNWZ8dHR0dxvwRwCmsvl3MLCggcLWq/1Nzp8u66uzjU1NbmGhgY/a2trXXV1tQczUBogMra2tryH+EoRoPfS6fSHI8FsAjo/P+/BGxsbp2XFFwFSzc3Nrq2tzbW2tnooSkgZP83NFibg29vbbnNz03sOj4UwvZKXHg8NDRXj4GqBvJXB0tMSMlNfX38KYFdXl2tvb/fQuJWx2JYG7kcx9jY2NnpjyBPJfCil+rTlZnx/xI+Li4toiXux9FRHR4fr7e11PT09DquJq1l5FLTkPv3GXs6gdHd3t2tpaeHsjampqScHwCQSrlFM3ulQCgsBdnZ2Oll+wK3HHXiGs8hCDjkiOc+mp6fPl/asrq4SmwH9cAtN2cgBksgy918G55BBfhA2FNF4OTMzU+XBJIPiOmGbgLLpJNA4nLjjbuKuPOlXvG94sK5BSpA0P1j2/ot7/+R2ZOJujJPc+35dV+cCGWnZyN/lHiY/eLI/k8mkuB8XycT4PS2XtYezHflcS4U2HWlxAI3sRarUQDYcDNPoB5xkwR6IclsbjzWMAD4b2WIloeZuZnj9miJ7b//HiHEKHmylrZIKIBsOUyMXaSFLZaGeVhKObDh8NX4Azlgt5VspsNVsDNT4TlZPssDTCbwSViMT2UF+QQk2GSm9P0mLAnWZKkUxLzcYw5APWDH+Ojg4mI30cCwI9BqLKd6hRJYNjotjRhXl4XF/hUOtfCGtsoCpz2zkwEnhZDCyaDYwTG7+ODw8POvBVCQ93rSjD6wNoiM5KZy4ImN5edl7Utb+VGwflZ5Q2pwQ9Pf6ptQY3LfeyroHntS/tT3x+2ruBcrM0/U5d0XWzpXAWEzwg3WP9HefNLxmDT6NgfVd8YbPnkGDMbGS5ASKlXQ3AXpzZGTk+4GiQY3E6nCxizpwXfBZfZ/bNaODwHL2WoWJ99XW0OM59tPa8tX5Oe27dBjqlSYBzDUW3xATGrMJgVIAbVr5DFXG2XmUPPQQvdeep4L+PLJoxBtyvEJMyOzgJtbvaN9dwQasfB4G21uvuS5ZX7kl+v/T7B+rlWWtuQxtcRVXADieCDlAU35ZM6XYdmie0SQ+s/r610jAbwIWjpP1vwCVDv6uCHVFxwAAAABJRU5ErkJggg==',
    sessionPause_base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAABfklEQVR4nO3SwU3DUBRFQRspTSDKBdqA4mLaeGxYsbWjODkzBVy/b51lAQAAAAAAAAA42MxcZuZ9ZrY5zva3eXn2+x7ezHwe+GP/+3j2+/Za733AzGzLsrzeaH5b1/Vtz8DZ79vrDAHMLffXdd31xrPft9fLPT/O/QkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHECSBOAHECiBNAnADiBBAngDgBxAkgTgBxAogTQJwA4gQQJ4A4AcQJIE4AcQKIE0CcAOIEECeAOAHEnSGAnxtubwdsnP2+Xc4QwNcNt78P2Dj7fY9tZi4z8z4z1znO9W/z8uz3AQAAAAAAAAD89wvZ40hJ20f6WgAAAABJRU5ErkJggg==',
    loader_svg: '<svg width="54px"  height="54px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-double-ring" style="background: none;"><circle cx="50" cy="50" ng-attr-r="{{config.radius}}" ng-attr-stroke-width="{{config.width}}" ng-attr-stroke="{{config.c1}}" ng-attr-stroke-dasharray="{{config.dasharray}}" fill="none" stroke-linecap="round" r="40" stroke-width="4" stroke="#cccccc" stroke-dasharray="62.83185307179586 62.83185307179586" transform="rotate(287.902 50 50)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></circle><circle cx="50" cy="50" ng-attr-r="{{config.radius2}}" ng-attr-stroke-width="{{config.width}}" ng-attr-stroke="{{config.c2}}" ng-attr-stroke-dasharray="{{config.dasharray2}}" ng-attr-stroke-dashoffset="{{config.dashoffset2}}" fill="none" stroke-linecap="round" r="35" stroke-width="4" stroke="#ffffff" stroke-dasharray="54.97787143782138 54.97787143782138" stroke-dashoffset="54.97787143782138" transform="rotate(-287.902 50 50)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;-360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></circle></svg>',
    pencil_base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfjAx0RIQbBz0+PAAAAn0lEQVQoz6XPMWoCYRCG4YeNLsZGcxjvENLmSEIK0SPYWZguRAi7raRxT5EDpLAUFMfCZXGzv1VmquH9vheG9Ix9+fF8hxqqhHDwksIjAwshhN+UvFI0kWW3vRNC6dGbd71uO+otDGRkrXZp0lx7J+eU/Lrrv/L/4uoGrzy0cV/u8z7m1UzuQ4ju3zAXdSSJ+RbCVN6VQ8+Tja2to0gFLuSUTEAjUjawAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTAzLTI5VDE2OjMzOjA2KzAxOjAw6lC0SQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wMy0yOVQxNjozMzowNiswMTowMJsNDPUAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC',
    eraser: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eraser" class="svg-inline--fa fa-eraser fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="skyblue" d="M497.941 273.941c18.745-18.745 18.745-49.137 0-67.882l-160-160c-18.745-18.745-49.136-18.746-67.883 0l-256 256c-18.745 18.745-18.745 49.137 0 67.882l96 96A48.004 48.004 0 0 0 144 480h356c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12H355.883l142.058-142.059zm-302.627-62.627l137.373 137.373L265.373 416H150.628l-80-80 124.686-124.686z"></path></svg>'
};

export default IMAGES;
