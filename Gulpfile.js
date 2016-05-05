var gulp = require('gulp');
var uglify = require('gulp-uglify');

var path = {
    assets: "server/public/assets/",
    vendors: "server/public/vendors/"
};

//Place any vendor sources here
var vendorSources = [
    "node_modules/angular/angular.min.js",
    "node_modules/angular/angular.js",
    "node_modules/angular/angular.min.js.map",
    "node_modules/bootstrap/dist/bootstrap.min.css",
    "node_modules/angular-route/angular-route.min.js",
    "node_modules/angular-route/angular-route.min.js.map",
    "node_modules/bootstrap/dist/js/bootstrap.min.js",
    "node_modules/bootstrap/dist/css/bootstrap.min.css.map",
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/socket.io-client/socket.io.js"
];

//Place any client side sources here
var assetSources = [
    "client/styles/**/*",
    "client/views/**/*"
];

//Pretty them up then put em to twerk
gulp.task('scripts', function() {
    return gulp.src('client/scripts/**/*')
        //.pipe(uglify())
        .pipe(gulp.dest("server/public/assets/scripts"))
});

//Assets all over the place
gulp.task('assets', function() {
    return gulp.src(assetSources, {base: "client/"})
        .pipe(gulp.dest(path.assets))
});

//Womp womp
gulp.task('vendors', function() {
    return gulp.src(vendorSources, {base: "node_modules/"})
        .pipe(gulp.dest(path.vendors));
});

//The accumulated filth of all their uncommented changes and commits will foam up about their waists
//and the programmers will look up and shout "save us!" ... and I'll whisper, "alright."
gulp.task('watch', function() {
    gulp.watch('client/scripts/**/*', ['scripts']);
    gulp.watch(['client/styles/**/*', 'client/views/**/*'], ['assets']);
});

//The prettiest gulp there ever was
gulp.task('default', ['scripts', 'assets', 'vendors']);