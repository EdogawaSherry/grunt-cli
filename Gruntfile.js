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
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-smushit');
    grunt.initConfig({
        // 配置目录
        config: config,
        browserify: {
            options: {
                debug: true,
                transform: ['brfs']
            },
            js: {
                expand: true,
                // 监听的文件目录
                cwd: `${config.src}/js/`,
                // 处理js文件，但不包括modules目录下的文件
                src: ['**/*.js', '!modules/**/*', '!tools/**/*'],
                // 处理后的文件目录
                dest: `${config.tmp}/js/`
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
                    cwd: `${config.tmp}/`,
                    src: ['js/*.js'],
                    dest: `${config.tmp}/`
                }]
            }
        },
        sprite: {
            options: {
                // 映射CSS中背景路径，支持函数和数组，默认为 null
                imagepath_map: null,
                // 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
                padding: 20,
                // 是否使用 image-set 作为2x图片实现，默认不使用
                useimageset: false,
                // 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
                newsprite: false,
                // 给雪碧图追加时间戳，默认不追加
                spritestamp: true,
                // 在CSS文件末尾追加时间戳，默认不追加
                cssstamp: true,
                // 默认使用二叉树最优排列算法
                algorithm: 'binary-tree'
            }
        },
        // 清除的配置
        clean: {
            tmp: {
                files: [{
                    src: [`${config.tmp}/`]
                }]
            },
            tools: {
                files: [{
                    src: [`${config.test}/js/tools/**/*.js`]
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
            // 雪碧图的转换 临时.tmp
            sprite_tmp: {
                files: [{
                    src: [`${config.src}/css/sprite/.tmp`]
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
            tools: {
                files: [{
                    expand: true,
                    cwd: `${config.src}`,
                    src: ['js/tools/**/*.js'],
                    dest: `${config.test}/`
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
        // 压缩图片 貌似不咋地
        smushit: {
            mygroup: {
                src: [`${config.test}/resource/img/**/*.{png,jpg,gif}`],
                dest: `${config.app}`
            }
        },
        watch: {
            options: {
                interval: 1000,
                spawn: false
            },
            files: ['<%= config.src %>/**/*']
        },
        stylus: {
            options: {
                compress: false,
                'include css': true,
                'resolve url': true
            },
            css: {
                expand: true,
                cwd: `${config.src}/css/sprite/.tmp/`,
                src: ['*.styl'],
                dest: `${config.src}/css/sprite/`,
                ext: '.less'
            }
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
            /**
                不知道为什么less的雪碧图，如果引入多个文件，就会出现重复的class 但是用styl是可以
                可我还是喜欢less，转换一下0.0
            */
            destCss: `${config.src}/css/sprite/.tmp/sprite/${spriteName}.styl`,
            padding: 25,
            imgPath: `../resource/img/sprite/${spriteName}.png`
            // 自定义名称 默认当前图片名称 下列方法无用功 只是演示
            // cssVarMap: (sprite) => {
            //     const sprites = sprite;
            //     sprites.name = `${sprite.name}`;
            // }
        });
        cleanSprite(spriteName);
        grunt.task.run('sprite:create');
        console.log(chalk.green('styl转less开始'));
        const styltext = `@import "sprite/${spriteName}.styl";
                        sprites($spritesheet_sprites);`;
        grunt.file.write(`${config.src}/css/sprite/.tmp/${spriteName}.styl`, styltext);
        grunt.task.run('stylus');
        grunt.task.run('clean:sprite_tmp');
        console.log(chalk.green('styl转less结束'));
        // 初次需要手动引入
        grunt.task.run('hash');
    }
    // watch
    let timer;
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
                    if (dirname.indexOf('sprite') !== -1 && type) {
                        // img资源改变就会执行，为了防止过多次执行，设置定时器，500ms watch没有执行即可视为资源变动完毕
                        clearTimeout(timer);
                        timer = setTimeout(
                            () => {
                                spriteName = dirname.replace(/^src\/resource\/img\/sprite\//, '');
                                createSprite(spriteName);
                            },
                            500
                        );
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
                if (dirname.indexOf('tools') !== -1) {
                    grunt.task.run('tools');
                } else {
                    grunt.task.run('hash');
                }
                break;
            // no default
        }
    });
    // js
    grunt.registerTask('babelJs', ['browserify:js', 'babel']);
    // JS工具
    grunt.registerTask('tools', ['clean:tools', 'copy:tools']);
    // hash处理
    grunt.registerTask('hash', ['clean:js', 'clean:css', 'clean:tmp', 'copy:html', 'babelJs', 'less', 'useminPrepare', 'concat', 'filerev', 'usemin', 'copy:tmp', 'clean:tmpOther', 'clean:tmp']);
    // 处理图片
    grunt.registerTask('img', ['copy:spriteTmp', 'clean:img', 'copy:img', 'copy:spriteImg', 'clean:spriteTmp']);
    // 音频
    grunt.registerTask('audio', ['clean:audio', 'copy:audio']);
    // 视频
    grunt.registerTask('video', ['clean:video', 'copy:video']);
    // 打包发布
    grunt.registerTask('build', ['clean:app', 'copy:app', 'uglify', 'cssmin']);
    // 如果需要压缩图片 发布之后 这个压缩工具不咋地
    grunt.registerTask('buildImg', ['smushit']);
    grunt.registerTask('default', ['tools', 'watch']);
};
