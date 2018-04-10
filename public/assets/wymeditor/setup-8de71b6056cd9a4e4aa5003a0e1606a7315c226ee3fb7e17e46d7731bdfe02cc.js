if(!WYMeditor) { var WYMeditor = {}; }

//Wrap the Firebug console in WYMeditor.console
(function() {
  if ( !window.console || !console.firebug ) {
    var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
    "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];

    WYMeditor.console = {};
    for (var i = 0; i < names.length; ++i)
      WYMeditor.console[names[i]] = function() {};

  } else { WYMeditor.console = window.console; }
})();
$.extend(WYMeditor, {

/*
    Constants: Global WYMeditor constants.

    VERSION             - Defines WYMeditor version.
    INSTANCES           - An array of loaded WYMeditor.editor instances.
    STRINGS             - An array of loaded WYMeditor language pairs/values.
    SKINS               - An array of loaded WYMeditor skins.
    NAME                - The "name" attribute.
    INDEX               - A string replaced by the instance index.
    WYM_INDEX           - A string used to get/set the instance index.
    BASE_PATH           - A string replaced by WYMeditor's base path.
    SKIN_PATH           - A string replaced by WYMeditor's skin path.
    WYM_PATH            - A string replaced by WYMeditor's main JS file path.
    SKINS_DEFAULT_PATH  - The skins default base path.
    SKINS_DEFAULT_CSS   - The skins default CSS file.
    LANG_DEFAULT_PATH   - The language files default path.
    IFRAME_BASE_PATH    - A string replaced by the designmode iframe's base path.
    IFRAME_DEFAULT      - The iframe's default base path.
    JQUERY_PATH         - A string replaced by the computed jQuery path.
    DIRECTION           - A string replaced by the text direction (rtl or ltr).
    LOGO                - A string replaced by WYMeditor logo.
    TOOLS               - A string replaced by the toolbar's HTML.
    TOOLS_ITEMS         - A string replaced by the toolbar items.
    TOOL_NAME           - A string replaced by a toolbar item's name.
    TOOL_TITLE          - A string replaced by a toolbar item's title.
    TOOL_CLASS          - A string replaced by a toolbar item's class.
    CLASSES             - A string replaced by the classes panel's HTML.
    CLASSES_ITEMS       - A string replaced by the classes items.
    CLASS_NAME          - A string replaced by a class item's name.
    CLASS_TITLE         - A string replaced by a class item's title.
    CONTAINERS          - A string replaced by the containers panel's HTML.
    CONTAINERS_ITEMS    - A string replaced by the containers items.
    CONTAINER_NAME      - A string replaced by a container item's name.
    CONTAINER_TITLE     - A string replaced by a container item's title.
    CONTAINER_CLASS     - A string replaced by a container item's class.
    HTML                - A string replaced by the HTML view panel's HTML.
    IFRAME              - A string replaced by the designmode iframe.
    STATUS              - A string replaced by the status panel's HTML.
    DIALOG_TITLE        - A string replaced by a dialog's title.
    DIALOG_BODY         - A string replaced by a dialog's HTML body.
    BODY                - The BODY element.
    STRING              - The "string" type.
    BODY,DIV,P,
    H1,H2,H3,H4,H5,H6,
    PRE,BLOCKQUOTE,
    A,BR,IMG,
    TABLE,TD,TH,
    UL,OL,LI            - HTML elements string representation.
    CLASS,HREF,SRC,
    TITLE,ALT           - HTML attributes string representation.
    DIALOG_LINK         - A link dialog type.
    DIALOG_IMAGE        - An image dialog type.
    DIALOG_TABLE        - A table dialog type.
    DIALOG_PASTE        - A 'Paste' dialog type.
    BOLD                - Command: (un)set selection to <strong>.
    ITALIC              - Command: (un)set selection to <em>.
    CREATE_LINK         - Command: open the link dialog or (un)set link.
    INSERT_IMAGE        - Command: open the image dialog or insert an image.
    INSERT_TABLE        - Command: open the table dialog.
    PASTE               - Command: open the paste dialog.
    INDENT              - Command: nest a list item.
    OUTDENT             - Command: unnest a list item.
    TOGGLE_HTML         - Command: display/hide the HTML view.
    FORMAT_BLOCK        - Command: set a block element to another type.
    PREVIEW             - Command: open the preview dialog.
    UNLINK              - Command: unset a link.
    INSERT_UNORDEREDLIST- Command: insert an unordered list.
    INSERT_ORDEREDLIST  - Command: insert an ordered list.
    MAIN_CONTAINERS     - An array of the main HTML containers used in WYMeditor.
    BLOCKS              - An array of the HTML block elements.
    KEY                 - Standard key codes.
    NODE                - Node types.

*/

    VERSION                 : "0.5-rc1-refinery",
    INSTANCES               : [],
    STRINGS                 : [],
    SKINS                   : [],
    NAME                  : "name",
    INDEX                   : "{Wym_Index}",
    WYM_INDEX               : "wym_index",
    BASE_PATH               : "{Wym_Base_Path}",
    CSS_PATH              : "{Wym_Css_Path}",
    WYM_PATH              : "{Wym_Wym_Path}",
    SKINS_DEFAULT_PATH    : "/assets/wymeditor/skins/wymeditor_icon.png",
    SKINS_DEFAULT_CSS      : "skin.css",
    SKINS_DEFAULT_JS      : "skin.js",
    LANG_DEFAULT_PATH       : "/assets/wymeditor/lang/en.js",
    IFRAME_BASE_PATH      : "{Wym_Iframe_Base_Path}",
    IFRAME_DEFAULT        : "iframe/default/",
    JQUERY_PATH             : "{Wym_Jquery_Path}",
    DIRECTION               : "{Wym_Direction}",
    LOGO                  : "{Wym_Logo}",
    TOOLS                   : "{Wym_Tools}",
    TOOLS_ITEMS             : "{Wym_Tools_Items}",
    TOOL_NAME               : "{Wym_Tool_Name}",
    TOOL_TITLE            : "{Wym_Tool_Title}",
    TOOL_CLASS            : "{Wym_Tool_Class}",
    CLASSES                 : "{Wym_Classes}",
    CLASSES_ITEMS           : "{Wym_Classes_Items}",
    CLASS_NAME            : "{Wym_Class_Name}",
    CLASS_TITLE             : "{Wym_Class_Title}",
    CONTAINERS            : "{Wym_Containers}",
    CONTAINERS_ITEMS      : "{Wym_Containers_Items}",
    CONTAINER_NAME        : "{Wym_Container_Name}",
    CONTAINER_TITLE         : "{Wym_Containers_Title}",
    CONTAINER_CLASS         : "{Wym_Container_Class}",
    HTML                  : "{Wym_Html}",
    IFRAME                : "{Wym_Iframe}",
    STATUS                : "{Wym_Status}",
    DIALOG_TITLE          : "{Visual_Editor_Dialog_Title}",
    DIALOG_BODY             : "{Visual_Editor_Dialog_Body}",
    STRING                : "string",
    BODY                  : "body",
    DIV                     : "div",
    P                       : "p",
    H1                    : "h1",
    H2                    : "h2",
    H3                    : "h3",
    H4                    : "h4",
    H5                    : "h5",
    H6                    : "h6",
    PRE                     : "pre",
    BLOCKQUOTE            : "blockquote",
    A                       : "a",
    BR                    : "br",
    IMG                     : "img",
    TABLE                   : "table",
    TD                    : "td",
    TH                    : "th",
    UL                    : "ul",
    OL                    : "ol",
    LI                    : "li",
    CLASS                  : "class",
    HREF                  : "href",
    SRC                     : "src",
    TITLE                   : "title",
    TARGET                : "target",
    ALT                    : "alt",
    REL                     : 'data-rel',
    DIALOG_LINK             : "Link",
    DIALOG_IMAGE          : "Image",
    DIALOG_TABLE          : "Table",
    DIALOG_PASTE          : "Paste_From_Word",
    DIALOG_CLASS          : "Css_Class",
    BOLD                  : "Bold",
    ITALIC                : "Italic",
    CREATE_LINK             : "CreateLink",
    INSERT_IMAGE          : "InsertImage",
    INSERT_TABLE          : "InsertTable",
    INSERT_HTML             : "InsertHTML",
    APPLY_CLASS            : "Apply_Style",
    PASTE                   : "Paste",
    INDENT                : "Indent",
    OUTDENT                 : "Outdent",
    TOGGLE_HTML             : "ToggleHtml",
    FORMAT_BLOCK          : "FormatBlock",
    PREVIEW                 : "Preview",

    UNLINK                 : "Unlink",
    INSERT_UNORDEREDLIST   : "InsertUnorderedList",
    INSERT_ORDEREDLIST     : "InsertOrderedList",

    MAIN_CONTAINERS : new Array("p","h1","h2","h3","h4","h5","h6","pre","blockquote"),

    BLOCKS : new Array("address", "blockquote", "div", "dl",
     "fieldset", "form", "h1", "h2", "h3", "h4", "h5", "h6", "hr",
     "noscript", "ol", "p", "pre", "table", "ul", "dd", "dt",
     "li", "tbody", "td", "tfoot", "th", "thead", "tr", "meter",
     "section", "article", "aside", "details", "header", "footer",
     "nav", "dialog", "figure", "figcaption", "address", "hgroup",
     "mark", "time", "canvas", "audio", "video", "output",
     "progress", "ruby", "rt", "rp", "summary", "command"),

    KEY : {
      BACKSPACE: 8,
      ENTER: 13,
      END: 35,
      HOME: 36,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      CURSOR: new Array(37, 38, 39, 40),
      DELETE: 46
    },

    NODE : {
      ELEMENT: 1,
      ATTRIBUTE: 2,
      TEXT: 3
    },

    /*
        Class: WYMeditor.editor
        WYMeditor editor main class, instanciated for each editor occurrence.
    */

    editor : function(elem, options) {
        /*
            Constructor: WYMeditor.editor

            Initializes main values (index, elements, paths, ...)
            and call WYMeditor.editor.init which initializes the editor.

            Parameters:

                elem - The HTML element to be replaced by the editor.
                options - The hash of options.

            Returns:

                Nothing.

            See Also:

                <WYMeditor.editor.init>
        */

        //store the instance in the INSTANCES array and store the index
        this._index = WYMeditor.INSTANCES.push(this) - 1;
        //store the element replaced by the editor
        this._element = elem;
        //store the options
        this._options = options;
        //store the element's inner value
        this._html = $(elem).val();

        //store the HTML option, if any
        if(this._options.html) { this._html = this._options.html; }

        //get or compute the base path (where the main JS file is located)
        this._options.basePath = this._options.basePath || this.computeBasePath();

        //get or set the skin path (where the skin files are located)
        this._options.skinPath = this._options.skinPath || (this._options.basePath + WYMeditor.SKINS_DEFAULT_PATH) + this._options.skin + '/';

        // set css and js skin paths
        this._options.cssCompiledSkinPath = this._options.cssCompiledSkinPath || ((this._options.cssSkinPath || this._options.skinPath) + this._options.skin + "/");
        this._options.jsCompiledSkinPath = this._options.jsCompiledSkinPath || ((this._options.jsSkinPath || this._options.skinPath) + this._options.skin + "/");

        //get or compute the main JS file location
        this._options.wymPath = this._options.wymPath || this.computeWymPath();

        //get or set the language files path
        this._options.langPath = this._options.langPath || this._options.basePath + WYMeditor.LANG_DEFAULT_PATH;

        //get or set the designmode iframe's base path
        this._options.iframeBasePath = this._options.iframeBasePath || this._options.basePath + WYMeditor.IFRAME_DEFAULT;

        //get or compute the jQuery JS file location
        this._options.jQueryPath = this._options.jQueryPath || this.computeJqueryPath();

        //initialize the editor instance
        this.init();
  }

});


/********** JQUERY **********/

/**
 * Replace an HTML element by WYMeditor
 *
 * @example $(".wymeditor").wymeditor(
 *        {
 *
 *        }
 *      );
 * @desc Example description here
 *
 * @name WYMeditor
 * @description WYMeditor is a web-based WYSIWYM XHTML editor
 * @param Hash hash A hash of parameters
 * @option Integer iExample Description here
 * @option String sExample Description here
 *
 * @type jQuery
 * @cat Plugins/WYMeditor
 * @author Jean-Francois Hovinne
 */
$.fn.wymeditor = function(options) {

  options = $.extend({

    html:       "",

    basePath:   false,

    skinPath:    false,
    jsSkinPath: false,
    cssSkinPath: false,

    wymPath:    false,

    iframeBasePath: false,

    jQueryPath: false,

    styles: false,

    stylesheet: false,

    skin:       "default",
    initSkin:   true,
    loadSkin:   true,

    lang:       refinery.current_admin_locale,

    direction:  "ltr",

    boxHtml: "<div class='visual_editor_box'>"
              + "<div class='wym_area_top'>" + WYMeditor.TOOLS + "</div>"
              + "<div class='wym_area_left'></div>"
              + "<div class='wym_area_right'>" + WYMeditor.CONTAINERS + WYMeditor.CLASSES + "</div>"
              + "<div class='wym_area_main'>" + WYMeditor.HTML + WYMeditor.IFRAME + WYMeditor.STATUS + "</div>"
              + "<div class='wym_area_bottom'>" + WYMeditor.LOGO + "</div>"
             + "</div>",

    logoHtml:  "<a class='wym_wymeditor_link' href='http://www.wymeditor.org/'>WYMeditor</a>",

    iframeHtml:"<div class='wym_iframe wym_section'>"
                + "<iframe src='" + WYMeditor.IFRAME_BASE_PATH + "wymiframe.html' onload='"
                  + "this.contentWindow.parent.WYMeditor.INSTANCES[" + WYMeditor.INDEX + "].initIframe(this)'>"
                + "</iframe>"
               + "</div>",

    editorStyles: [],

    toolsHtml: "<div class='wym_tools wym_section'>"
                + "<h2>{Tools}</h2>"
                + "<ul>" + WYMeditor.TOOLS_ITEMS + "</ul>"
               + "</div>",

    toolsItemHtml:"<li class='" + WYMeditor.TOOL_CLASS + "'>"
                    + "<a href='#' name='" + WYMeditor.TOOL_NAME + "' title='" + WYMeditor.TOOL_TITLE + "'>"
                      + WYMeditor.TOOL_TITLE
                    + "</a>"
                  + "</li>",

    toolsItems: [
        {'name': 'Bold', 'title': 'Strong', 'css': 'wym_tools_strong'},
        {'name': 'Italic', 'title': 'Emphasis', 'css': 'wym_tools_emphasis'},
        {'name': 'Superscript', 'title': 'Superscript', 'css': 'wym_tools_superscript'},
        {'name': 'Subscript', 'title': 'Subscript', 'css': 'wym_tools_subscript'},
        {'name': 'InsertOrderedList', 'title': 'Ordered_List', 'css': 'wym_tools_ordered_list'},
        {'name': 'InsertUnorderedList', 'title': 'Unordered_List', 'css': 'wym_tools_unordered_list'},
        {'name': 'Indent', 'title': 'Indent', 'css': 'wym_tools_indent'},
        {'name': 'Outdent', 'title': 'Outdent', 'css': 'wym_tools_outdent'},
        {'name': 'Undo', 'title': 'Undo', 'css': 'wym_tools_undo'},
        {'name': 'Redo', 'title': 'Redo', 'css': 'wym_tools_redo'},
        {'name': 'CreateLink', 'title': 'Link', 'css': 'wym_tools_link'},
        {'name': 'Unlink', 'title': 'Unlink', 'css': 'wym_tools_unlink'},
        {'name': 'InsertImage', 'title': 'Image', 'css': 'wym_tools_image'},
        {'name': 'InsertTable', 'title': 'Table', 'css': 'wym_tools_table'},
        {'name': 'Paste', 'title': 'Paste_From_Word', 'css': 'wym_tools_paste'},
        {'name': 'ToggleHtml', 'title': 'HTML', 'css': 'wym_tools_html'},
        {'name': 'Preview', 'title': 'Preview', 'css': 'wym_tools_preview'}
    ],

    containersHtml:    "<div class='wym_containers wym_section'>"
                        + "<h2>{Containers}</h2>"
                        + "<ul>"
                        + WYMeditor.CONTAINERS_ITEMS
                        + "</ul>"
                        + "</div>",

    containersItemHtml:"<li class='" + WYMeditor.CONTAINER_CLASS + "'>"
                         + "<a href='#' name='" + WYMeditor.CONTAINER_NAME + "'>"
                           + WYMeditor.CONTAINER_TITLE
                         + "</a>"
                       +"</li>",

    containersItems: [
        {'name': 'P', 'title': 'Paragraph', 'css': 'wym_containers_p'},
        {'name': 'H1', 'title': 'Heading_1', 'css': 'wym_containers_h1'},
        {'name': 'H2', 'title': 'Heading_2', 'css': 'wym_containers_h2'},
        {'name': 'H3', 'title': 'Heading_3', 'css': 'wym_containers_h3'},
        {'name': 'H4', 'title': 'Heading_4', 'css': 'wym_containers_h4'},
        {'name': 'H5', 'title': 'Heading_5', 'css': 'wym_containers_h5'},
        {'name': 'H6', 'title': 'Heading_6', 'css': 'wym_containers_h6'},
        {'name': 'PRE', 'title': 'Preformatted', 'css': 'wym_containers_pre'},
        {'name': 'BLOCKQUOTE', 'title': 'Blockquote', 'css': 'wym_containers_blockquote'},
        {'name': 'TH', 'title': 'Table_Header', 'css': 'wym_containers_th'}
    ],

    classesHtml:       "<div class='wym_classes wym_section'>"
                        + "<h2>{Classes}</h2><ul>"
                        + WYMeditor.CLASSES_ITEMS
                        + "</ul></div>",

    classesItemHtml:   "<li class='wym_classes_" + WYMeditor.CLASS_NAME + "'>"
                        + "<a href='#' name='" + WYMeditor.CLASS_NAME + "'>"
                          + WYMeditor.CLASS_TITLE
                        + "</a>"
                      +"</li>",

    classesItems:      [],

    statusHtml:        "<div class='wym_status wym_section'>"
                        + "<h2>{Status}</h2>"
                      +"</div>",

    htmlHtml:          "<div class='wym_html wym_section'>"
                        + "<h2>{Source_Code}</h2>"
                        + "<textarea class='wym_html_val'></textarea>"
                      +"</div>",

    boxSelector:       ".visual_editor_box",
    toolsSelector:     ".wym_tools",
    toolsListSelector: " ul",
    containersSelector:".wym_containers",
    classesSelector:   ".wym_classes",
    htmlSelector:      ".wym_html",
    iframeSelector:    ".wym_iframe iframe",
    iframeBodySelector:".wym_iframe",
    statusSelector:    ".wym_status",
    toolSelector:      ".wym_tools a",
    containerSelector: ".wym_containers a",
    classSelector:     ".wym_classes a",
    classUnhiddenSelector: ".wym_classes",
    classHiddenSelector: ".wym_classes_hidden",
    htmlValSelector:   ".wym_html_val",

    hrefSelector:      ".visual_editor_href",
    srcSelector:       ".visual_editor_src",
    titleSelector:     ".visual_editor_title",
    targetSelector:    ".visual_editor_target",
    altSelector:       ".visual_editor_alt",
    textSelector:      ".wym_text",
    sizeSelector:      ".visual_editor_size",

    rowsSelector:      ".wym_rows",
    colsSelector:      ".wym_cols",
    captionSelector:   ".wym_caption",
    summarySelector:   ".wym_summary",

    submitSelector:    ".wym_submit",
    cancelSelector:    ".wym_cancel",
    previewSelector:   "",

    dialogTypeSelector:    ".visual_editor_dialog_type",
    dialogLinkSelector:    ".visual_editor_dialog_link",
    dialogImageSelector:   ".visual_editor_dialog_image",
    dialogTableSelector:   ".visual_editor_dialog_table",
    dialogPasteSelector:   ".visual_editor_dialog_paste",
    dialogPreviewSelector: ".visual_editor_dialog_preview",

    updateSelector:    ".wymupdate",
    updateEvent:       "click",

    dialogFeatures:    {
      width: 560
      , height: 300
    }

    , dialogFeaturesPreview: "menubar=no,titlebar=no,toolbar=no,resizable=no,scrollbars=yes,width=560,height=300,top=0,left=0"

    , dialogHtml:"<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN'"
                  + " 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>"
                  + "<html dir='" + WYMeditor.DIRECTION + "'>"
                  + "<head>"
                    + "<link rel='stylesheet' type='text/css' media='screen'" + " href='" + WYMeditor.CSS_PATH + "' />"
                    + "<title>" + WYMeditor.DIALOG_TITLE + "</title>"
                    + "<script type='text/javascript' src='" + WYMeditor.JQUERY_PATH + "'></script>"
                    + "<script type='text/javascript' src='" + WYMeditor.WYM_PATH + "'></script>"
                  + "</head>"
                    + WYMeditor.DIALOG_BODY
                  + "</html>",

    dialogLinkHtml:  "<div class='visual_editor_dialog visual_editor_dialog_link'>"
               + "<form>"
               + "<fieldset>"
               + "<input type='hidden' id='visual_editor_dialog_type' class='visual_editor_dialog_type' value='"
               + WYMeditor.DIALOG_LINK
               + "' />"
               + "<legend>{Link}</legend>"
               + "<div class='row'>"
               + "<label>{URL}</label>"
               + "<input type='text' class='visual_editor_href' value='' size='40' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Title}</label>"
               + "<input type='text' class='visual_editor_title' value='' size='40' />"
               + "</div>"
               + "<div class='row row-indent'>"
               + "<input class='wym_submit button' type='button'"
               + " value='{Submit}' />"
               + "<input class='wym_cancel' type='button'"
               + "value='{Cancel}' />"
               + "</div>"
               + "</fieldset>"
               + "</form>"
               + "</div>",

    dialogImageHtml:  "<div class='visual_editor_dialog visual_editor_dialog_image'>"
               + "<form>"
               + "<fieldset>"
               + "<input type='hidden' id='visual_editor_dialog_type' class='visual_editor_dialog_type' value='"
               + WYMeditor.DIALOG_IMAGE
               + "' />"
               + "<legend>{Image}</legend>"
               + "<div class='row'>"
               + "<label>{URL}</label>"
               + "<input type='text' class='visual_editor_src' value='' size='40' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Alternative_Text}</label>"
               + "<input type='text' class='visual_editor_alt' value='' size='40' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Title}</label>"
               + "<input type='text' class='visual_editor_title' value='' size='40' />"
               + "</div>"
               + "<div class='row row-indent'>"
               + "<input class='wym_submit button' type='button'"
               + " value='{Submit}' />"
               + "<input class='wym_cancel' type='button'"
               + "value='{Cancel}' />"
               + "</div>"
               + "</fieldset>"
               + "</form>"
               + "</div>",

    dialogTableHtml:  "<div class='visual_editor_dialog visual_editor_dialog_table'>"
               + "<form>"
               + "<input type='hidden' id='visual_editor_dialog_type' class='visual_editor_dialog_type' value='"
               + WYMeditor.DIALOG_TABLE
               + "' />"
               + "<div class='row'>"
               + "<label>{Caption}</label>"
               + "<input type='text' class='wym_caption' value='' size='40' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Summary}</label>"
               + "<input type='text' class='wym_summary' value='' size='40' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Number_Of_Rows}</label>"
               + "<input type='text' class='wym_rows' value='3' size='3' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Number_Of_Cols}</label>"
               + "<input type='text' class='wym_cols' value='2' size='3' />"
               + "</div>"
               + "<div class='row row-indent'>"
               + "<input class='wym_submit button' type='button'"
               + " value='{Submit}' />"
               + "<input class='wym_cancel' type='button'"
               + "value='{Cancel}' />"
               + "</div>"
               + "</form>"
               + "</div>",

    dialogPasteHtml:  "<div class='visual_editor_dialog visual_editor_dialog_paste'>"
               + "<form>"
               + "<input type='hidden' id='visual_editor_dialog_type' class='visual_editor_dialog_type' value='"
               + WYMeditor.DIALOG_PASTE
               + "' />"
               + "<fieldset>"
               + "<legend>{Paste_From_Word}</legend>"
               + "<div class='row'>"
               + "<textarea class='wym_text' rows='10' cols='50'></textarea>"
               + "</div>"
               + "<div class='row'>"
               + "<input class='wym_submit button' type='button'"
               + " value='{Submit}' />"
               + "<input class='wym_cancel' type='button'"
               + "value='{Cancel}' />"
               + "</div>"
               + "</fieldset>"
               + "</form>"
               + "</div>",

    dialogPreviewHtml: "<div class='visual_editor_dialog visual_editor_dialog_preview'></div>",

    dialogStyles: [],

    stringDelimiterLeft: "{",
    stringDelimiterRight:"}",

    preInit: null,
    preBind: null,
    postInit: null,

    preInitDialog: null,
    postInitDialog: null

  }, options);

  return this.each(function() {

    new WYMeditor.editor($(this),options);
  });
};

/* @name extend
 * @description Returns the WYMeditor instance based on its index
 */
$.extend({
  wymeditors: function(i) {
    return (WYMeditor.INSTANCES[i]);
  }
});
