import assets._setup_env as duik
duik.init()
B = duik.builder

if __name__ == '__main__':
    #B.build_jsx()
    #B.build_mkdocs()
    #B.build_jsdoc()
    B.deploy_jsx()
