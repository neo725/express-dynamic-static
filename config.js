module.exports = {
    'development': {
        'path': './fake_folders',
        'port': 8010,
        'default-pages': [
            'index.html',
            'index.htm',
            'default.html',
            'default.htm'
        ]
    },
    'production': {
        'path': '/users',
        'port': 8010,
        'default-pages': [
            'index.html',
            'index.htm',
            'default.html',
            'default.htm'
        ]
    }
}