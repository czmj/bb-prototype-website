module.exports = function(grunt) {
	'use strict';
	require('time-grunt')(grunt);
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		bowerrc: grunt.file.readJSON('.bowerrc'),
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> */ \n'
		},
		config: {
			// component settings
			bower: '<%= bowerrc.directory %>',
			// src settings
			src: 'src',
			srcAssets: 'assets',
			srcStyles: 'styles',
			srcScripts: 'scripts',
			srcTemp: 'temp',
			srcImages: 'images',
			srcFonts: 'fonts',
			// dist settings
			dist: 'dist',
			distStyles: 'styles',
			distScripts: 'scripts',
			distTemp: 'temp',
			distImages: 'images',
			distFonts: 'fonts',
			// misc settings
			pagePrefix: '<%= pkg.name %>_',
			partialPrefix: '<%= pkg.name %>_partial-',
			assembleExt: 'hbs',
			mainCss: 'main.css',
			ieCss: 'ie.css',
			mainRtlCss: 'main.rtl.css',
			ieRtlCss: 'ie.rtl.css'
		},
		watch: {
			html: {
				files: [
					'<%= config.src %>/{data,pages,partials,layouts}/{,*/}*.{<%= config.assembleExt %>,yml,json}'
				],
				tasks: [
					'build_html'
				]
			},
			scripts: {
				files: [
					'<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/**/**.js',
				],
				tasks: [
					'build_scripts',
					'modernizr'
				]
			},
			styles: {
				files: [
					'<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/*.css',
					'<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/less/*.less',
					'<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/less/_mixins/mixins-*.less'
				],
				tasks: [
					'build_styles',
					'modernizr'
				]
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= config.dist %>/{,*/}*.html',
					'<%= config.dist %>/<%= config.distAssets %>/{,*/}*.css',
					'<%= config.dist %>/<%= config.distAssets %>/{,*/}*.js',
					'<%= config.dist %>/<%= config.distAssets %>/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},
		connect: {
			options: {
				port: 8008,
				livereload: 35730,
				useAvailablePort: true,
				// change this to '0.0.0.0' to access the server from outside
				hostname: 'localhost'
			},
			livereload: {
				options: {
					open: true,
					base: ['<%= config.dist %>']
				}
			}
		},
		assemble: {
			options: {
				flatten: false,
				layout: false,
				partials: [
					'<%= config.src %>/partials/**/*.<%= config.assembleExt %>',
					'<%= config.src %>/layouts/**/*.<%= config.assembleExt %>'
				],
				helpers: [
					'<%= config.src %>/helpers/helper-*.js'
				],
				assets: '<%= config.dist %>',
				images: '<%= config.distImages %>',
				styles: '<%= config.distStyles %>',
				scripts: '<%= config.distScripts %>',
				temp: '<%= config.distTemp %>',
				mainCss: '<%= config.mainCss %>',
				mainRtlCss: '<%= config.mainRtlCss %>',
				ieCss: '<%= config.ieCss %>',
				ieRtlCss: '<%= config.ieRtlCss %>',
				data: [
					'<%= config.src %>/data/*.{json,yml}',
					'package.json' ,
				]
			},
			pages: {
				files: [{
					expand: true,
					cwd: '<%= config.src %>/pages/',
					src: '**/*.<%= config.assembleExt %>',
					dest: '<%= config.dist %>/',
					rename: function(dest, src) {
						var filename = src;
						if (src.substring(0, 1) === '_') {
							filename = dest + src.substring(1);
						} else if(src.indexOf('/') !== -1) {
							var index = null,
								splitSrc = src.split('/');
							filename = dest + '<%= config.pagePrefix %>';
							for (index = 0; index < splitSrc.length; ++index) {
								filename = filename + splitSrc[index];
								if (src.indexOf('.<%= config.assembleExt %>')) {
									filename = filename + '-';
								}
							}
						} else {
							filename = dest + '<%= config.pagePrefix %>' + src;
						}
						return filename;
					}
				}]
			},
			components: {
				files: [{
					expand: true,
					cwd: '<%= config.src %>/partials/',
					src: '**/*.<%= config.assembleExt %>',
					dest: '<%= config.dist %>/',
					rename: function(dest, src) {
						var filename = src;
						if (src.substring(0, 1) === '_') {
							filename = dest + src.substring(1);
						} else if(src.indexOf('/') !== -1) {
							var index = null,
								splitSrc = src.split('/');
							filename = dest + '<%= config.partialPrefix %>' + splitSrc.pop();
						} else {
							filename = dest + '<%= config.partialPrefix %>' + src;
						}
						return filename;
					}
				}]
			}
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				globals: {
					node: true,
					exports: true,
					require: true,
					module: true,
					jQuery: true,
					$: true,
					window: true,
					console: true,
					Modernizr: true,
					clearTimeout: true,
					setTimeout: true,
					navigator: true,
					bb: true
				}
			},
			all: [
				'<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/modules/*.js',
				'Gruntfile.js'
			]
		},
		concat: {
			lessMixins: {
				src: [
					'<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/less/_mixins/*.less'
				],
				dest: '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/less/_mixins/_combined.less'
			},
			jquery: {
				src: [
					'<%= config.bower %>/jquery/dist/jquery.js'
				],
				dest: '<%= config.dist %>/<%= config.distScripts %>/jquery.js'
			},
			scripts: {
				src: [
					'<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/plugins/combine/*.js',
					'<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/modules/combine/*.js',
					'<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/_init.js'
				],
				dest: '<%= config.dist %>/<%= config.distScripts %>/scripts.js'
			},
			ieScripts: {
				src: [
					'<%= config.bower %>/nwmatcher/src/nwmatcher.js',
					'<%= config.bower %>/selectivizr/selectivizr.js'
				],
				dest: '<%= config.dist %>/<%= config.distScripts %>/ie.js'
			},
			validation: {
				src: [
					'<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/validation/*.js'
				],
				dest: '<%= config.dist %>/<%= config.distScripts %>/validation.js'
			}
		},
		uglify: {
			options: {
				//banner: '<%= meta.banner %>',
				preserveComments: 'some',
				mangle: true,
				compress: {
					drop_console: true
				}
			},
			jquery: {
				src: '<%= config.dist %>/<%= config.distScripts %>/jquery.js',
				dest: '<%= config.dist %>/<%= config.distScripts %>/jquery.js'
			},
			scripts: {
				src: '<%= config.dist %>/<%= config.distScripts %>/scripts.js',
				dest: '<%= config.dist %>/<%= config.distScripts %>/scripts.js'
			},
			ieScripts: {
				src: '<%= config.dist %>/<%= config.distScripts %>/ie.js',
				dest: '<%= config.dist %>/<%= config.distScripts %>/ie.js'
			}
		},
		less: {
			main: {
				options: {
					yuicompress: false,
					sourceMap: true,
					sourceMapFilename: '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainCss %>.map',
					sourceMapURL: '<%= config.mainCss %>.map',
					sourceMapRootpath: '/'
				},
				files: {
					'<%= config.dist %>/<%= config.distStyles %>/<%= config.mainCss %>': '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/less/_order.less'
				}
			},
			rtl: {
				options: {
					yuicompress: false,
					sourceMap: true,
					sourceMapFilename: '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainRtlCss %>.map',
					sourceMapURL: '<%= config.mainRtlCss %>.map',
					sourceMapRootpath: '/'
				},
				files: {
					'<%= config.dist %>/<%= config.distStyles %>/<%= config.mainRtlCss %>': '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/less/_order.less'
				}
			}
		},
		css_mqpacker: {
			options: {
				map: '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainCss %>.map'
			},
			main: {
				src: '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainCss %>',
				dest: '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainCss %>'
			}
		},
		stripmq: {
			ie: {
				files: {
					'<%= config.dist %>/<%= config.distStyles %>/<%= config.ieCss %>': '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainCss %>'
				}
			},
			ieRtl : {
				files: {
					'<%= config.dist %>/<%= config.distStyles %>/<%= config.ieRtlCss %>': '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainRtlCss %>'
				}
			}
		},
		cssmin: {
			main: {
				src: '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainCss %>',
				dest: '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainCss %>'
			},
			mainRtl: {
				src: '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainRtlCss %>',
				dest: '<%= config.dist %>/<%= config.distStyles %>/<%= config.mainRtlCss %>'
			},
			ie: {
				src: '<%= config.dist %>/<%= config.distStyles %>/<%= config.ieCss %>',
				dest: '<%= config.dist %>/<%= config.distStyles %>/<%= config.ieCss %>'
			},
			ieRtl: {
				src: '<%= config.dist %>/<%= config.distStyles %>/<%= config.ieRtlCss %>',
				dest: '<%= config.dist %>/<%= config.distStyles %>/<%= config.ieRtlCss %>'
			}
		},
		copy: {
			bb: {
				files: [
					{
						expand: true,
						cwd: '<%= config.src %>/<%= config.srcAssets %>/_bb/',
						src: ['**'],
						dest: '<%= config.dist %>/_bb'
					}
				]
			},
			assets: {
				files: [
					{
						expand: true,
						cwd: '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcImages %>/',
						src: ['**'],
						dest: '<%= config.dist %>/<%= config.distImages %>/'
					},
					{
						expand: true,
						cwd: '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcFonts %>/',
						src: ['**'],
						dest: '<%= config.dist %>/<%= config.distStyles %>/<%= config.distFonts %>/'
					},
					{
						expand: true,
						cwd: '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcTemp %>/',
						src: ['**'],
						dest: '<%= config.dist %>/<%= config.distTemp %>/'
					}
				]
			},
			scripts: {
				files: [
					{
						expand: true,
						cwd: '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/modules/',
						src: ['*.js'],
						dest: '<%= config.dist %>/<%= config.distScripts %>/'
					}
				]
			},
			styles: {
				files: [
					{
						expand: true,
						cwd: '<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/',
						src: ['*.css'],
						dest: '<%= config.dist %>/<%= config.distStyles %>/'
					}
				]
			},
			deploy: {
				files: [
					{
						expand: true,
						cwd: '<%= config.dist %>/',
						src: ['**'],
						dest: '<%= grunt.option(\'dest\') %>'
					}
				]
			}
		},
		clean: {
			production: [
				'<%= config.dist %>/<%= config.distStyles %>/<%= config.mainCss %>.map'
			],
			html: [
				'<%= config.dist %>/*.html'
			],
			scripts: [
				'<%= config.dist %>/<%= config.srcScripts %>'
			],
			styles: [
				'<%= config.dist %>/<%= config.srcStyles %>'
			],
			mixins: [
				'<%= config.src %>/<%= config.srcAssets %>/<%= config.srcStyles %>/less/_mixins/_combined.less'
			],
			everything: [
				'<%= config.dist %>'
			],
			deploy: []
		},
		modernizr: {
			dist: {
				'devFile': '<%= config.bower %>/modernizr/modernizr.js',
				'outputFile': '<%= config.dist %>/<%= config.distScripts %>/modernizr.js',
				'parseFiles': true,
				'files': {
					'src': [
						'<%= config.dist %>/<%= config.distScripts %>/*.js',
						'<%= config.dist %>/<%= config.distStyles %>/*.css'
					]
				},
				'extra' : {
					'shiv' : true,
					'printshiv' : false,
					'load' : true,
					'mq' : false,
					'cssclasses' : true
				},
				'extensibility' : {
					'addtest' : false,
					'prefixed' : false,
					'teststyles' : false,
					'testprops' : false,
					'testallprops' : false,
					'hasevents' : false,
					'prefixes' : false,
					'domprefixes' : false
				}
			}
		},
		replace: {
			dist: {
				options: {
					patterns: [
						{
							match: 'version',
							replacement: '<%= pkg.version %>'
						},
						{
							match: 'timestamp',
							replacement: '<%= grunt.template.today("mmm dS yyyy, h:MMtt Z") %>'
						}
					]
				},
				files: [
					{
						expand: true,
						flatten: true,
						src: [
							'<%= config.dist %>/*.html'
						],
						dest: '<%= config.dist %>/'
					}
				]
			}
		},
		jscs: {
			options: {
				config: '.jscsrc',
				requireCurlyBraces: [ 'if' ]
			},
			scripts: [
				'<%= config.src %>/<%= config.srcAssets %>/<%= config.srcScripts %>/modules/{,*/}*.js'
			]
		},
		prettify: {
			options: {
				'indent': 1,
				'indent_char': '	', // tab
				'indent_scripts': 'normal',
				'wrap_line_length': 0,
				'brace_style': 'collapse',
				'preserve_newlines': true,
				'max_preserve_newlines': 1,
				'unformatted': [
					'code',
					'pre'
				]
			},
			deploy: {
				expand: true,
				cwd: '<%= config.dist %>/',
				ext: '.html',
				src: ['*.html'],
				dest: '<%= config.dist %>/'
			}
		},
		zip: {
			deploy: {
				cwd: '<%= config.dist %>/',
				src: ['<%= config.dist %>/**/*'],
				dest: 'dist.zip'
			}
		},
		devUpdate: {
			report: {
				options: {
					updateType: 'report', //just report outdated packages
					reportUpdated: false, //don't report already updated packages
					semver: true, //use package.json semver rules when updating
					packages: { //what packages to check
						devDependencies: true, //only devDependencies
						dependencies: false
					},
					packageJson: './package.json'
				}
			},
			prompt: {
				options: {
					updateType: 'prompt',
					reportUpdated: false,
					semver: false,
					packages: {
						devDependencies: true,
						dependencies: true
					},
					packageJson: './package.json'
				}
			},
			force: {
				options: {
					updateType: 'force',
					reportUpdated: false,
					semver: false,
					packages: {
						devDependencies: true,
						dependencies: true
					},
					packageJson: './package.json'
				}
			}
		}
	});
	// Register tasks.
	grunt.loadNpmTasks('assemble');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-stripmq');
	grunt.loadNpmTasks('grunt-css-mqpacker');
	grunt.loadNpmTasks('grunt-modernizr');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-prettify');
	grunt.loadNpmTasks('grunt-jscs-checker');
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-dev-update');
	// Build tasks.
	grunt.registerTask('build_html', [
		'clean:html',
		'assemble',
		'copy:assets',
		'replace'
	]);
	grunt.registerTask('build_scripts', [
		'clean:scripts',
		'jscs',
		'jshint',
		'concat:jquery',
		'concat:scripts',
		'concat:ieScripts',
		'concat:validation',
		'copy:scripts'
	]);
	grunt.registerTask('build_styles', [
		'clean:styles',
		'concat:lessMixins',
		'less',
		'css_mqpacker',
		'stripmq',
		'copy:styles',
		'copy:assets',
		'clean:mixins'
	]);
	grunt.registerTask('build_dev', [
		'build_html',
		'build_scripts',
		'build_styles',
		'modernizr',
		'copy:bb'
	]);
	grunt.registerTask('build_production', [
		'build_dev',
		'cssmin',
		'uglify',
		'prettify',
		'clean:production'
	]);
	// Default task.
	grunt.registerTask('default', [
		'clean:everything',
		'build_dev',
		'watch'
	]);
	// Local server task.
	grunt.registerTask('server', [
		'clean:everything',
		'build_dev',
		'connect:livereload',
		'watch'
	]);
	// Dev.
	grunt.registerTask('dev', [
		'build_dev'
	]);
	// Production task.
	grunt.registerTask('production', [
		'build_production'
	]);
	// Deploy task.
	grunt.registerTask('deploy', [
		'build_production',
		'copy:deploy',
		'clean:deploy',
		'zip:deploy'
	]);
};
