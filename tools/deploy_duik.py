import assets._setup_env as duik
duik.init()
B = duik.builder

if __name__ == '__main__':
    #B.build_jsx()
    #B.build_mkdocs()
    B.build_jsdoc()
    # TODO 
    # Deploy to dist/ and types/
    # Deploy: add License, readme
    # Deploy: ZIP with correct name
