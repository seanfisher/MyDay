function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function init() {
        $.index.open();
    }
    function okButtonClicked() {
        Alloy.createController("myDay");
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        navBarHidden: true,
        backgroundGradient: {
            type: "linear",
            startPoint: {
                x: "50%",
                y: "0%"
            },
            endPoint: {
                x: "50%",
                y: "100%"
            },
            colors: [ {
                color: "#D6CEC3",
                offset: 0
            }, {
                color: "#E4DDCA",
                offset: 1
            } ]
        },
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.__alloyId0 = Ti.UI.createLabel(function() {
        var o = {};
        _.extend(o, {
            color: "black",
            font: {
                fontSize: "24dip"
            },
            top: "15%",
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
        });
        Alloy.isTablet && _.extend(o, {
            font: {
                fontSize: "50dip"
            }
        });
        _.extend(o, {
            text: "Houston Learning Series",
            id: "__alloyId0"
        });
        return o;
    }());
    $.__views.index.add($.__views.__alloyId0);
    $.__views.logo = Ti.UI.createImageView({
        center: {
            x: "50%",
            y: null
        },
        bottom: "2%",
        height: "20%",
        id: "logo",
        image: "/pariveda_logo.png"
    });
    $.__views.index.add($.__views.logo);
    $.__views.__alloyId1 = Ti.UI.createButton({
        backgroundColor: "#007AFF",
        borderRadius: "5dip",
        width: "50%",
        height: "7%",
        bottom: "40%",
        color: "white",
        title: "See the demo",
        id: "__alloyId1"
    });
    $.__views.index.add($.__views.__alloyId1);
    okButtonClicked ? $.__views.__alloyId1.addEventListener("click", okButtonClicked) : __defers["$.__views.__alloyId1!click!okButtonClicked"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    init();
    __defers["$.__views.__alloyId1!click!okButtonClicked"] && $.__views.__alloyId1.addEventListener("click", okButtonClicked);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;