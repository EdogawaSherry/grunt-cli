const grunt = require('./node_modules/grunt');
const chalk = require('./node_modules/chalk');
const path = require('path');
// grunt的load和time的工具，输出在控制台
require('load-grunt-tasks')(grunt);
require('time-grunt')(grunt);
// 配置目录
const config = {
    src: 'src', // 开发目录
    tmp: 'src/.tmp', // 临时目录
    test: 'test', // 测试
    app: 'app' // 正式
};
const regSlash = /\\/g;
module.exports = () => {
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-smushit');
    grunt.loadNpmTasks('grunt-filerev');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.initConfig({
        // 配置目录
        config: config,
        browserify: {
            options: {
                debug: grunt.option('debug'),
                transform: ['brfs']
            },
            js: {
                expand: true,
                // 监听的文件目录
                cwd: '<%= config.tmp %>/js/',
                // 处理js文件，但不包括modules目录下的文件
                src: ['**/*.js'],
                // 处理后的文件目录
                dest: '<%= config.tmp %>/js'
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['env']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: `${config.src}/`,
                    src: ['js/*.js'],
                    dest: `${config.tmp}/`
                }]
            }
        },
        // 清除的配置
        clean: {
            tmp: {
                files: [{
                    src: [`${config.tmp}/`]
                }]
            },
            // 不知道为何多了个.tmp 删除
            tmpOther: {
                files: [{
                    src: ['.tmp']
                }]
            },
            js: {
                files: [{
                    src: [`${config.test}/js/*.js`]
                }]
            },
            css: {
                files: [{
                    src: [`${config.test}/css/*.css`]
                }]
            },
            img: {
                files: [{
                    src: [`${config.test}/resource/img/**/*`]
                }]
            },
            spriteTmp: {
                files: [{
                    src: [`${config.test}/resource/.spriteTmp`]
                }]
            },
            video: {
                files: [{
                    src: [`${config.test}/resouce/video/**/*`]
                }]
            },
            audio: {
                files: [{
                    src: [`${config.test}/resouce/audio/**/*`]
                }]
            },
            app: {
                files: [{
                    src: [`${config.app}/`]
                }]
            }
        },
        less: {
            development: {
                options: {
                    cleancss: true,
                    compress: true
                },
                files: {
                    '<%= config.tmp %>/css/main.css': '<%= config.src %>/css/index.less'
                }
            }
        },
        filerev: {
            build: {
                files: [{
                    src: [`${config.tmp}/css/*.css`, `${config.tmp}/js/*.js`]
                }]
            }
        },
        concat: {
            js: {
                ptions: {
                    separator: ';\n'
                },
                src: [`${config.tmp}/js/*.js`],
                dest: `${config.tmp}/js/main.js`
            },
            css: {
                options: {
                    separator: '\n'
                },
                src: [`${config.tmp}/css/*.css`],
                dest: `${config.tmp}/css/main.css`
            }
        },
        useminPrepare: {
            build: {
                files: [{
                    expand: true,
                    cwd: `${config.src}/`,
                    src: ['*.html']
                }]
            }
        },
        usemin: {
            html: {
                files: [{
                    src: `${config.tmp}/*.html`
                }]
            },
            css: {
                files: [{
                    src: `${config.tmp}/css/*.css`
                }]
            }
        },
        copy: {
            html: {
                files: [{
                    expand: true,
                    cwd: `${config.src}`,
                    src: ['*.html'],
                    dest: `${config.tmp}/`
                }]
            },
            tmp: {
                files: [{
                    expand: true,
                    cwd: `${config.tmp}`,
                    src: ['*.html', 'js/*.js', 'css/*.css'],
                    dest: `${config.test}/`
                }]
            },
            img: {
                files: [{
                    expand: true,
                    cwd: `${config.src}/`,
                    src: ['resource/img/**/*', '!resource/img/sprite/**/*'],
                    dest: `${config.test}/`
                }]
            },
            spriteImg: {
                files: [{
                    expand: true,
                    cwd: `${config.test}/resource/.spriteTmp/`,
                    src: ['sprite/**/*'],
                    dest: `${config.test}/resource/img`
                }]
            },
            spriteTmp: {
                files: [{
                    expand: true,
                    cwd: `${config.test}/resource/img/`,
                    src: ['sprite/**/*'],
                    dest: `${config.test}/resource/.spriteTmp`
                }]
            },
            audio: {
                files: [{
                    expand: true,
                    cwd: `${config.src}`,
                    src: ['resource/audio/*'],
                    dest: `${config.test}`
                }]
            },
            video: {
                files: [{
                    expand: true,
                    cwd: `${config.src}`,
                    src: ['resource/video/*'],
                    dest: `${config.test}`
                }]
            },
            app: {
                files: [{
                    expand: true,
                    cwd: `${config.test}`,
                    src: ['*.html', 'css/**/*.css', 'js/**/*.js', 'resource/**'],
                    dest: `${config.app}`
                }]
            }
        },
        uglify: {
            dist: {
                files: [{
                    expand: true,
                    cwd: `${config.app}/`,
                    src: '**/*.js',
                    dest: `${config.app}/`
                }]
            }
        },
        cssmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: `${config.app}/`,
                    src: '**/*.css',
                    dest: `${config.app}/`
                }]
            }
        },
        watch: {
            options: {
                interval: 1000,
                spawn: false
            },
            files: ['<%= config.src %>/**/*']
        }
    });
    // 删除雪碧图 貌似不需要删除 复制过来就直接替换了0.0
    function cleanSprite(spriteName) {
        grunt.config('clean.sprite', {
            files: [{
                src: `${config.test}/resouce/sprite/${spriteName}.png`
            }]
        });
    }
    // 构建雪碧图 传入雪碧图名称 img/sprite/[spriteName]/*.png
    function createSprite(spriteName) {
        grunt.config('sprite.create', {
            src: [`${config.src}/resource/img/sprite/${spriteName}/*.png`],
            dest: `${config.test}/resource/img/sprite/${spriteName}.png`,
            destCss: `${config.src}/css/sprite/${spriteName}.less`,
            padding: 25,
            imgPath: `../resource/img/sprite/${spriteName}.png`,
            // 自定义名称 默认当前图片名称 下列方法无用功 只是演示
            cssVarMap: (sprite) => {
                const sprites = sprite;
                sprites.name = `${sprite.name}`;
            }
        });
        cleanSprite(spriteName);
        grunt.task.run('sprite:create');
        grunt.task.run('hash');
    }
    // watch
    grunt.event.on('watch', (action, filepaths) => {
        // 资源路径
        const dirname = path.dirname(filepaths).replace(regSlash, '/');
        // 资源名称
        const name = path.basename(filepaths).split('.')[0];
        // 资源类型
        const type = path.extname(filepaths).substring(1);
        let spriteName;
        let files;
        grunt.log.oklns(chalk.blue(`dirname: ${dirname}`));
        grunt.log.oklns(chalk.blue(`name: ${name}`));
        grunt.log.oklns(chalk.blue(`type: ${type}`));

        // resource
        if (dirname.indexOf('resource') !== -1) {
            files = dirname.replace(/^src\/resource\//, '');
            // console.log(chalk.yellow(files));
            if (files.indexOf('/') !== -1) {
                files = files.slice(0, files.indexOf('/'));
            }
            // console.log(chalk.yellow(files));
            switch (files) {
                case 'img':
                    // 雪碧图sprite文件下
                    if (dirname.indexOf('sprite') !== -1) {
                        spriteName = dirname.replace(/^src\/resource\/img\/sprite\//, '');
                        createSprite(spriteName);
                    } else {
                        grunt.task.run('img');
                    }
                    break;
                case 'audio':
                    grunt.task.run('audio');
                    break;
                case 'video':
                    grunt.task.run('video');
                    break;
                // no default
            }
        }
        switch (type) {
            case 'html':
                grunt.task.run('hash');
                break;
            case 'less':
                grunt.task.run('hash');
                break;
            case 'js':
                grunt.task.run('hash');
                break;
            // no default
        }
    });
    // js
    grunt.registerTask('babelJs', ['babel', 'browserify:js']);
    // hash处理
    grunt.registerTask('hash', ['clean:js', 'clean:css', 'clean:tmp', 'copy:html', 'babelJs', 'less', 'useminPrepare', 'concat', 'filerev', 'usemin', 'copy:tmp', 'clean:tmpOther', 'clean:tmp']);
    grunt.registerTask('default', ['watch']);
    // 处理图片
    grunt.registerTask('img', ['copy:spriteTmp', 'clean:img', 'copy:img', 'copy:spriteImg', 'clean:spriteTmp']);
    // 音频
    grunt.registerTask('audio', ['clean:audio', 'copy:audio']);
    // 视频
    grunt.registerTask('video', ['clean:video', 'copy:video']);
    // 打包发布
    grunt.registerTask('build', ['clean:app', 'copy:app', 'uglify', 'cssmin']);
};
