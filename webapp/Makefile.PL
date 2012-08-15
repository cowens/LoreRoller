use strict;
use warnings;
use ExtUtils::MakeMaker;

WriteMakefile(
    NAME                => 'LoreRoller',
    AUTHOR              => q{Chas. Owens <chas.owens@gmail.com>},
    VERSION_FROM        => 'lib/LoreRoller.pm',
    ABSTRACT            => 'LoreRoller is a die roller and character manager for the Lore RPG',
    ($ExtUtils::MakeMaker::VERSION >= 6.3002
      ? ('LICENSE'=> 'perl')
      : ()),
    PL_FILES            => {},
    PREREQ_PM => {
	    'Test::More' => 0,
	    'YAML'       => 0,
	    'Dancer'     => 1.3030,
	    'Plack'      => 0.9974,
	    'Template'   => 2.24,
	    'JSON'       => 2.53,
    },
    dist                => { COMPRESS => 'gzip -9f', SUFFIX => 'gz', },
    clean               => { FILES => 'LoreRoller-*' },
);
