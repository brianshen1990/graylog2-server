
# Graylog 2.3.1_CN_0.1

## Translation to CN for most pages, especially those pages which should be displayed to customers.

## Customisation Product Name and Logo

1. logo : ``graylog2-server\graylog2-web-interface\public\images``
2. Name : I use xxxx to replace, you can use your IDE to search adn replace them all.

## Customization Function

This part, you can find in file ``graylog2-server\graylog2-web-interface\src\util\AppConfig.js``
Some examples:

![image](./readme_img/extractors.png)
![image](./readme_img/search.png)

1. I add copy extractor with K-V split, and sen a message, then , I want to hide the middle stored value.
2. Default, I show some columns I need. And define the sequences of them.
3. I also can add some hidden search conditions.

All these functions is disabled in the code and you can just turn them on and modify according to your requirements.


## Warning:
1. If you cannot compile them , go to the my repo named ``https://github.com/brianshen1990/GrayLog2CompileMachine``
and instructions ``https://brianshen1990.github.io/Graylog2_Compile_And_Installation_on_Linux_Base.html``

2. Just copying ``graylog2-server`` and ``graylog2-web-itnterface`` is enough and them compile it.
![image](./readme_img/files.png)

--------------------------------------------------------------

# Graylog

[![Build Status](https://travis-ci.org/Graylog2/graylog2-server.svg?branch=master)](https://travis-ci.org/Graylog2/graylog2-server)
[![License](https://img.shields.io/github/license/Graylog2/graylog2-server.svg)](https://www.gnu.org/licenses/gpl-3.0.txt)
[![Maven Central](https://img.shields.io/maven-central/v/org.graylog2/graylog2-server.svg)](http://mvnrepository.com/artifact/org.graylog2/graylog2-server)

Welcome! _Graylog_ is an open source log management platform.

You can read more about the project on our [website](https://www.graylog.org/) and check out the [documentation](http://docs.graylog.org/) on the documentation site.


## Issue Tracking

Found a bug? Have an idea for an improvement? Feel free to [add an issue](../../issues).


## Contributing

Help us build the future of log management and be part of a project that is used by thousands of people out there every day.

Follow the [contributors guide](https://graylog.org/get-involved) and read [the contributing instructions](CONTRIBUTING.md) to get started.


## Staying in Touch

Come chat with us in the [`#graylog` channel on freenode IRC](https://webchat.freenode.net/?channels=%23graylog) or write an [email to the mailing list](https://groups.google.com/forum/#!forum/graylog2).


## Miscellaneous

![YourKit](https://s3.amazonaws.com/graylog2public/images/yourkit.png)

YourKit supports our open source project by sponsoring its full-featured Java Profiler. YourKit, LLC is the creator of [YourKit Java Profiler](http://www.yourkit.com/java/profiler/index.jsp) and [YourKit .NET Profiler](http://www.yourkit.com/.net/profiler/index.jsp), innovative and intelligent tools for profiling Java and .NET applications.


## License

_Graylog_ is released under version 3.0 of the [GNU General Public License](COPYING).
