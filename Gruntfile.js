module.exports = function (grunt) {
    var css_path = 'assets/css';
    var js_path = 'assets/script';
    var less_path = 'assets/less';
    var template_path = 'assets/template/';
    var banner = '//\r\n' +
        '/** \r\n' +
        ' * @fileOverview <%= pkg.description %> \r\n' +
        ' * @version <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> \r\n' +
        ' * @author <%= pkg.author.name %> \r\n' +
        ' */ \r\n';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        css_path: css_path,
        less_path: less_path,
        js_path: js_path,
        template_path: template_path,
        js_template_path: js_path + '/template',
        js_model_path: js_path + '/model',
        js_collection_path: js_path + '/collection',
        js_view_path: js_path + '/view',
        js_router_path: js_path + '/router',
        js_mixin_path: js_path + '/mixin',
        clean: {
            css: ['<%= css_path %>/*.css',
                '<%= css_path %>/<%= pkg.name %>.css',
                '<%= css_path %>/nl.css',
                '<%= css_path %>/toastr.css',
                '<%= css_path %>/bootstrap.css'],
            js: [
                '<%=js_template_path %>/template.js',
                '<%=js_path %>/<%= pkg.name %>.js',
                '<%=js_path%>/<%= pkg.name%>.min.js',
                '<%=js_path%>/<%= pkg.name%>.min.js.map'
            ]
        },
        jshint: {
            files: ['Gruntfile.js', '<%= js_model_path %>/*.js', '<%= js_collection_path %>/*.js', '<%= js_view_path %>/*.js', '<%= js_router_path %>/*.js']
        },
        concat: {
            options: {
                sourceMap: false,
                banner: '<%= banner %>'
            },
            js: {
                files: {
                    'public/js/<%= pkg.name %>.js': ['assets/lib/jquery/dist/jquery.js',
                        'assets/lib/bootstrap/dist/js/bootstrap.js',
                        'assets/lib/bootstrap-checkbox/dist/js/bootstrap-checkbox.js',
                        'assets/lib/toastr/toastr.js',
                        'assets/lib/underscore/underscore.js',
                        'assets/lib/backbone/backbone.js',
                        /*'assets/lib/backbone.babysitter/lib/backbone.babysitter.js',
                        'assets/lib/backbone.wreqr/lib/backbone.wreqr.js',
                        'assets/lib/marionette/lib/core/backbone.marionette.js',*/
                        '<%= js_template_path %>/template.js',
                        '<%= js_template_path %>/Start.js',
                        '<%= js_model_path %>/*.js',
                        '<%= js_collection_path %>/*.js',
                        '<%= js_router_path %>/*.js',
                        '<%= js_view_path %>/*.js']
                }
            },
            css: {
                files: {
                    'public/css/<%= pkg.name %>.css': ['<%= css_path %>/nl.css', '<%= css_path %>/toastr.css', '<%= css_path %>/bootstrap.css'],
                }
            }

        },
        jst: {
            dev: {
                options: {
                    namespace: 'NL.Template',
                    prettify: true,
                    amd: false,
                    processName: function (filename) {
                        return filename.replace(template_path, '')
                            .replace('.html', '')
                            .replace('.htm', '');
                    },
                    processContent: function (src) {
                        return src.replace(/(^\s+|\s+$)/gm, '');
                    }
                },
                files: {
                    '<%= js_template_path %>/template.js': ["<%= template_path %>/*.htm", "<%= template_path %>/*.html"]
                }
            }
        },
        uglify: {
            dev: {
                options: {
                    mangle: false,
                    compress: {
                        dead_code: true, // jshint ignore:line
                        properties: true,
                        drop_debugger: true,
                        hoist_funs: true
                    },
                    beautify: {
                        quote_style: 1
                    },
                    output: {
                        ascii_only: true // jshint ignore:line
                    },
                    report: 'min',
                    preserveComments: 'some',
                },
                files: {
                    'public/js/<%= pkg.name%>.min.js': ['public/js/<%= pkg.name%>.js']
                }
            }
        },
        cssmin: {
            options: {
                banner: '<%= banner %>'
            },
            dev: {
                options: {
                    report: 'min',
                    keepSpecialComments: '*'
                },
                files: {
                    'public/css/<%= pkg.name %>.min.css': 'public/css/<%= pkg.name %>.css'
            }
            }
        },
        less: {
            development: {
                options: {
                    banner: '<%= banner %>',
                    smarttabs: true,
                    optimization: 2
                },
                files: {
                    '<%= css_path %>/nl.css': '<%= less_path %>/nl.less',
                    '<%= css_path %>/toastr.css': 'assets/lib/toastr/toastr.less',
                    '<%= css_path %>/bootstrap.css': 'assets/lib/bootstrap/less/bootstrap.less'
                }
            }
        },
        watch: {
            styles: {
                files: ['<%= less_path %>/*.less'],
                tasks: ['build-styles'],
                options: {
                    livereload: true,
                    nospawn: true
                }
            },
            js: {
                files: ['gruntfile.js',
                    '<%=js_path%>/**/*.js',
                    '<%= template_path %>/*.html',
                    '<%= template_path %>/*.htm'],
                tasks: ['build-js'],
                options: {
                    livereload: true,
                    nospawn: true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('build-styles', ['clean:css', 'less:development', 'concat:css']);
    grunt.registerTask('build-js', ['clean:js', 'jst:dev', 'jshint', 'concat:js', 'uglify:dev']);
    grunt.registerTask('build', ['clean:css', 'less:development', 'concat:css', 'cssmin:dev', 'clean:js', 'jst:dev', 'jshint', 'concat:js', 'uglify:dev']);
    grunt.registerTask('watch-styles', ['watch:styles']);
    grunt.registerTask('watch-js', ['watch:js']);
    grunt.registerTask('default', ['watch']);

};
