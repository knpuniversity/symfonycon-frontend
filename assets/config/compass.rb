# Compass configuration file! See: http://compass-style.org/help/tutorials/configuration-reference/

# Target directory where the CSS files will be built
css_dir = "web/assets/css"

# Source directory of the sass files
# Notice this is *not* in web - we're not copying these files to web, because
# we don't need to (we can just tell Compass to look here)
sass_dir = "assets/sass"


# The following things we don't care about as much, but here you go :)

# Used with the image-url helper
images_dir = "web/assets/images"
# For its purpose, see https://groups.google.com/forum/#!topic/compass-users/rjAntZ8RZgs
javascripts_dir = "web/assets/js"

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
#relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass
