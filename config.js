var _config = {
    'development': {
        'host': 'http://localhost',
        'path': './fake_users',
        'port': 8010,
        'search-level': 3,
        'default-pages': [
            'index.html',
            'index.htm',
            'default.html',
            'default.htm'
        ]
    },
    'production': {
        'host': 'http://edlc',
        'path': '/users',
        'port': 3000,
        'search-level': 3,
        'default-pages': [
            'index.html',
            'index.htm',
            'default.html',
            'default.htm'
        ]
    }
}

module.exports = _config