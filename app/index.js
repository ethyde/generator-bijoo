/*global require, module*/
"use strict";

var util = require("util");
var path = require("path");
var yeoman = require("yeoman-generator");

var BijooGenerator = yeoman.generators.Base.extend({
    promptUser: function() {
        var done = this.async();

        var welcome =
        '\n WelCoum to the Bijoo-Generator \n';

        // have Yeoman greet the user
        console.log(welcome);

        var prompts = [{
            name: "projectName",
            message: "What is the name of your project ? (Without space)",
            default: "My_Bijoo_project"
        },
        {
            type: "confirm",
            name: "cmsFwOrNot",
            message: "Do you use au CMS or Framework ?",
            default: false
        },
        {
            name: "whereDevAssets",
            message: "Where to put development assets files and folders ?",
            default: "dev"
        },
        {
            name: "whereBuildAssets",
            message: "Where to put final build assets files and folders ?",
            default: "dist"
        }];

        this.prompt(prompts, function (props) {
            this.projectName = props.projectName;
            this.cmsFwOrNot = props.cmsFwOrNot;
            this.whereDevAssets = props.whereDevAssets;
            this.whereBuildAssets = props.whereBuildAssets;

            done();
        }.bind(this));
    },
    processFilesAndFolder: function(){
        this.directory("dev", this.whereDevAssets);

        this.template("_gruntfile.js", "gruntfile.js");
        this.template("_package.json", "package.json");
        this.template("_bower.json", "bower.json");

        this.copy("editorconfig", ".editorconfig");
        this.copy("bowerrc", ".bowerrc");

        if ( this.cmsFwOrNot === false ) {
            this.template("_robots.txt", "robots.txt");
            this.template("_humans.txt", "humans.txt");
            this.template("_README.md", "README.md");
            this.copy("gitignore", ".gitignore");
            this.copy("gitattributes", ".gitattributes");
            this.copy("htaccess", ".htaccess");
        }

    },
    end: function() {
        this.installDependencies({
            skipInstall: this.options["skip-install"]
        });
    }
});

module.exports = BijooGenerator;
