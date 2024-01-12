import { getInput, info, setFailed } from "@actions/core";
import { getOctokit } from "@actions/github";
import { createKanbanPage } from "./ghkb";

try {
  const projectUrl = getInput("project-url");
  const token = getInput("token");
  const outFile = getInput("out-html-file");

  const matches = projectUrl.match(
    /github\.com\/users\/(\w+)\/projects\/(\d+)/
  )!;
  const username = matches[1];
  const projectId = matches[2];

  info(
    `Extracted username (${username}) and project id (${projectId}) from project-url`
  );

  createKanbanPage({
    username,
    projectId,
    outFile,
    overrides: {
      graphql: getOctokit(token).graphql,
      htmlTemplateContents: `<!DOCTYPE html>
<html lang="en">

<head>
  <title>Serchinastico's Kanban</title>
  <!-- Meta -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <!-- Resources -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <% if (style) { %>
  <style>
    <%=style %>
  </style>
  <% } else { %>
  <link href="/styles.css" rel="stylesheet" />
  <% } %>
</head>

<body class="flex-1 bg-cloud">
  <header>
    <p class="flex-1 text-4xl font-bold text-center py-6 bg-ash text-white font-marker">
      <%= title %>
    </p>

    <p class="text-md font-regular p-4 italic font-space md:text-center md:p-8">
      <%= description %>
    </p>
  </header>

  <section class="p-4 flex flex-col md:flex-row">
    <% project.status.forEach((status) => { %>
    <div class="mb-8 flex-1" x-data="{ isOpen: true }">
      <div class="flex flex-row items-center mb-4 cursor-pointer" @click="isOpen = !isOpen">
        <div class="text-2xl font-bold font-marker"><%= status.name %></div>
        <div x-show="!isOpen" class="ml-2">
          <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.6664 5.01732C10.5544 5.04665 10.4718 5.08932 10.0184 5.33998C9.91709 5.39598 9.80776 5.48132 9.76776 5.53732C9.72776 5.59065 9.66109 5.67065 9.61843 5.71865C9.56243 5.77732 9.53843 5.83065 9.54109 5.88399C9.54643 6.07865 9.66909 6.22265 10.6798 7.24665C11.2211 7.79599 11.8291 8.41465 12.0264 8.61999C12.2264 8.82532 13.1091 9.72399 13.9864 10.62C16.1251 12.796 16.4584 13.1453 17.2664 14.06C18.5278 15.4867 19.2558 16.2387 19.5704 16.444C19.6664 16.5053 19.8984 16.6333 20.0878 16.7293C20.3704 16.8733 20.4264 16.9107 20.3971 16.9373C20.3758 16.956 20.2051 17.0973 20.0158 17.2493C19.6958 17.5053 19.4584 17.7107 18.3464 18.6867C17.9518 19.0333 17.2264 19.66 16.7598 20.06C16.3811 20.38 15.7544 20.9427 15.2798 21.38C14.7704 21.852 13.3118 23.244 12.6131 23.9267C12.2691 24.2627 11.7944 24.724 11.5624 24.9533C10.9598 25.54 10.6318 25.8893 10.4211 26.1667C10.3224 26.2973 10.1971 26.46 10.1438 26.5267C10.0904 26.5933 10.0238 26.6947 9.99443 26.7507C9.88243 26.9667 9.98109 27.4253 10.1784 27.6093C10.2558 27.6813 10.5438 27.8387 10.5784 27.828C10.5918 27.8253 10.6371 27.8413 10.6798 27.8653C10.8318 27.9453 11.1144 27.9747 11.5891 27.9613C12.2318 27.94 12.3758 27.8893 12.8664 27.492C13.3571 27.092 13.7118 26.708 14.9331 25.2467C16.3944 23.5 16.9144 22.9053 18.2238 21.5027C18.7064 20.9827 19.4638 20.1267 19.7598 19.7667C19.8691 19.6307 20.1091 19.3373 20.2931 19.1133C20.7971 18.4973 21.1544 18.068 21.4798 17.692C21.7571 17.372 21.7784 17.3533 21.8744 17.3533C21.9704 17.3533 21.9758 17.348 22.0531 17.1853C22.0984 17.092 22.1331 16.9987 22.1331 16.9773C22.1331 16.956 22.1518 16.916 22.1731 16.8893C22.1944 16.86 22.2131 16.82 22.2131 16.8013C22.2131 16.78 22.2398 16.7293 22.2691 16.6867L22.3278 16.612L22.2664 16.348C22.2344 16.204 22.2024 16.068 22.1971 16.044C22.1838 15.9933 22.0771 15.94 21.9891 15.94C21.9358 15.94 21.9224 15.9187 21.8931 15.7853C21.8131 15.428 21.6104 14.98 21.4184 14.74C21.3651 14.6733 21.1038 14.3667 20.8398 14.06C20.5731 13.7507 20.0558 13.14 19.6904 12.7C19.3224 12.26 18.8504 11.708 18.6398 11.4733C18.1251 10.8973 16.9118 9.68932 15.9198 8.76399C13.9091 6.88932 13.7571 6.76398 12.4664 5.95332C12.1011 5.72399 11.6318 5.42265 11.4264 5.28665C10.9464 4.97198 10.8984 4.95332 10.6664 5.01732Z" fill="black" />
          </svg>
        </div>
        <div x-show="isOpen" class="ml-2">
          <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.23473 10.1293C5.20539 10.1399 5.17073 10.1639 5.16006 10.1799C5.15206 10.1959 5.08006 10.2546 5.00273 10.3133C4.85873 10.4173 4.83206 10.4599 4.55739 10.9693C4.42673 11.2093 4.38406 11.3959 4.42673 11.5319C4.44539 11.5879 4.57073 11.8013 4.70673 12.0066C4.84273 12.2119 5.14406 12.6813 5.37339 13.0466C6.18406 14.3373 6.30939 14.4893 8.18406 16.5C9.10939 17.492 10.3174 18.7053 10.8934 19.22C11.1281 19.4306 11.6801 19.9026 12.1201 20.2706C12.5601 20.636 13.1734 21.1533 13.4801 21.42C13.7894 21.684 14.0934 21.9453 14.1601 21.9986C14.4001 22.1906 14.8481 22.3933 15.2081 22.4733C15.3387 22.5026 15.3601 22.516 15.3601 22.5693C15.3601 22.6573 15.4134 22.764 15.4641 22.7773C15.4881 22.7826 15.6241 22.8146 15.7681 22.8466L16.0321 22.908L16.1067 22.8493C16.1494 22.82 16.2001 22.7933 16.2214 22.7933C16.2401 22.7933 16.2801 22.7746 16.3094 22.7533C16.3361 22.732 16.3761 22.7133 16.3974 22.7133C16.4187 22.7133 16.5121 22.6786 16.6054 22.6333C16.7681 22.556 16.7734 22.5506 16.7734 22.4546C16.7734 22.3586 16.7921 22.3373 17.1121 22.06C17.4881 21.7346 17.9174 21.3773 18.5334 20.8733C18.7574 20.6893 19.0507 20.4493 19.1867 20.34C19.5467 20.044 20.4027 19.2866 20.9227 18.804C22.3254 17.4946 22.9201 16.9746 24.6667 15.5133C26.1281 14.2919 26.5121 13.9373 26.9121 13.4466C27.3094 12.9559 27.3601 12.8119 27.3814 12.1693C27.3947 11.6946 27.3654 11.4119 27.2854 11.2599C27.2614 11.2146 27.2454 11.1719 27.2481 11.1586C27.2587 11.1239 27.1014 10.8359 27.0294 10.7586C26.8454 10.5613 26.3867 10.4626 26.1707 10.5746C26.1147 10.6039 26.0134 10.6706 25.9467 10.7239C25.8801 10.7773 25.7201 10.9026 25.5867 11.0013C25.3094 11.2119 24.9601 11.5399 24.3734 12.1426C24.1441 12.3746 23.6827 12.8493 23.3467 13.1933C22.6641 13.8919 21.2721 15.3506 20.8001 15.86C20.3627 16.3346 19.8001 16.9613 19.4801 17.34C19.0801 17.8066 18.4534 18.532 18.1067 18.9266C17.1307 20.0386 16.9254 20.276 16.6694 20.596C16.5174 20.7853 16.3761 20.956 16.3574 20.9773C16.3307 21.0066 16.2934 20.9506 16.1494 20.668C16.0534 20.4786 15.9254 20.2466 15.8641 20.1506C15.6587 19.836 14.9067 19.108 13.4801 17.8466C12.5654 17.0386 12.2161 16.7053 10.0401 14.5666C9.14672 13.6893 8.24539 12.8066 8.04006 12.6066C7.83473 12.4093 7.22406 11.8066 6.68006 11.2706C6.10673 10.7026 5.64006 10.2626 5.56806 10.2226C5.41073 10.1319 5.30673 10.1026 5.23473 10.1293Z" fill="black" />
          </svg>
        </div>
      </div>

      <div x-show="isOpen">
        <% if (status.issues.length === 0) { %>
        <p class="mt-6 font-marker text-center text-2xl text-ash opacity-20 <%= Math.random() < 0.5 ? "rotate-3" : "-rotate-3" %>">Nothing here!</p>
        <% } else { %>
        <% status.issues.forEach((issue) => { %>
        <div class="shadow-md rounded-md mt-4 py-3 px-4 bg-white <%= Math.random() < 0.5 ? "rotate-0.5" : "-rotate-0.5" %>">
          <p class="text-lg font-space font-bold mb-2"><%= issue.title %></p>
          <div class="flex flex-row flex-wrap">
            <% issue.labels.forEach((label) => { %>
            <div class="px-2 py-0.5 rounded-md -rotate-2 mr-2 mb-2" style="background-color: #<%= label.color %>">
              <span class="text-md font-space <%= label.isDarkColor ? "text-white" : "text-ash" %>"><%= label.name %></span>
            </div>
            <% }); %>
          </div>
        </div>
        <% }); %>
        <% } %>
      </div>
    </div>
    <% }); %>
  </section>
</body>

</html>`,
      style: `/*! tailwindcss v3.4.1 | MIT License | https://tailwindcss.com*/*,:after,:before{box-sizing:border-box;border:0 solid}:after,:before{--tw-content:""}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:initial}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:initial;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:initial}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}*,::backdrop,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:#3b82f680;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.mb-2{margin-bottom:.5rem}.mb-4{margin-bottom:1rem}.mb-8{margin-bottom:2rem}.ml-2{margin-left:.5rem}.mr-2{margin-right:.5rem}.mt-4{margin-top:1rem}.mt-6{margin-top:1.5rem}.flex{display:flex}.flex-1{flex:1 1 0%}.-rotate-0{--tw-rotate:-0deg}.-rotate-0,.-rotate-0\.5{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.-rotate-0\.5{--tw-rotate:-0.5deg}.-rotate-2{--tw-rotate:-2deg}.-rotate-2,.-rotate-3{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.-rotate-3{--tw-rotate:-3deg}.rotate-0{--tw-rotate:0deg}.rotate-0,.rotate-0\.5{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.rotate-0\.5{--tw-rotate:0.5deg}.rotate-3{--tw-rotate:3deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.cursor-pointer{cursor:pointer}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.items-center{align-items:center}.rounded-md{border-radius:.375rem}.bg-ash{--tw-bg-opacity:1;background-color:rgb(30 31 37/var(--tw-bg-opacity))}.bg-cloud{--tw-bg-opacity:1;background-color:rgb(242 243 248/var(--tw-bg-opacity))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-4{padding:1rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-4{padding-left:1rem;padding-right:1rem}.py-0{padding-top:0;padding-bottom:0}.py-0\.5{padding-top:.125rem;padding-bottom:.125rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.text-center{text-align:center}.font-marker{font-family:Permanent Marker,cursive}.font-space{font-family:Space Mono,monospace}.text-2xl{font-size:1.5rem;line-height:2rem}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.font-bold{font-weight:700}.italic{font-style:italic}.text-ash{--tw-text-opacity:1;color:rgb(30 31 37/var(--tw-text-opacity))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.opacity-20{opacity:.2}.shadow-md{--tw-shadow:0 4px 6px -1px #0000001a,0 2px 4px -2px #0000001a;--tw-shadow-colored:0 4px 6px -1px var(--tw-shadow-color),0 2px 4px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)}@media (min-width:768px){.md\\:flex-row{flex-direction:row}.md\\:p-8{padding:2rem}.md\\:text-center{text-align:center}}`,
    },
  });
} catch (error: any) {
  setFailed(error.message);
}
