const webfont=require('webfont').default;
const {ICON,join}=require('../config.js');
const fs=require('fs');
const path=require('path');
const {run_promise} =require('../tool.js');


webfont({
  ...ICON
})
.then(async (msg)=>{
  try {
    // font

    for (let format of ICON.formats){
      await run_promise(
        fs.writeFile,
        path.join(
          ICON.files,
          ICON.templateFontPath,
          `${ICON.templateFontName}.${format}`
        ),
        msg[format]
      );
    }
    //css
    await run_promise(
      fs.writeFile,
      path.join(
        ICON.files,
        ICON.templateCSSPath,
        `${ICON.templateFontName}.css`
      ),
      msg.template.replace(/src:.*?(,)(?=\s?\n)/g,row=>row.slice(0,row.length-1)+';')
    )
  }catch(e){
    console.error(e)
  }

}).catch(err=>{
	console.error(err)
});
