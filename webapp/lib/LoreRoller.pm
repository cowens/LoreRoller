package LoreRoller;
use Dancer ':syntax';

our $VERSION = '0.2';

my $platform = -f "$ENV{HOME}/environment.json" ? 
	"https://loreroller-cowens.dotcloud.com" : "http://0.0.0.0:3000";

get "/" => sub {
	template "index.tt", { platform => $platform, css => 'loreroller', js => "loreroller" };
};

get "/loreroller.js" => sub {
	content_type 'application/javascript';
	template "loreroller.js.tt", { platform => $platform }, { layout => "js" };
};

get "/loreroller.xml" => sub {
	content_type 'text/xml';
	template "index.tt", { platform => $platform, css => 'loreroller', js => "loreroller" }, { layout => "xml" };
};

my $load = sub {
	my $callback = param "callback";
	my $name     = param "name";
	my $id       = param "id";
	my $file     = "$ENV{HOME}/data/$id-$name";

	my $save = do {
		local $/;
		open my $fh, "<", $file
			or die "could not open $file: $!";
		<$fh>;
	};

	debug $save;
	content_type 'application/json';
	return qq/$callback('$save')/;
};
post '/load' => $load;
get '/load' => $load;

my $save = sub {
	my $callback = param "callback";
	my $name     = param "name";
	my $id       = param "id";
	my $data     = param "data";

	$name =~ s{/}{%}g;
	$id =~ s{[^0-9]}{}g;
	
	open my $fh, ">", "$ENV{HOME}/data/$id-$name"
		or die "could not open $name: $!";

	print $fh $data;
	
	content_type 'application/json';
	return qq/$callback({ "status": "saved" })/;
};

get "/test" => sub {
	template "test.tt", { platform => $platform, css => "style", js => 'js/model' };
};
get "/test.xml" => sub {
	content_type 'text/xml';
	template "test.tt", { platform => $platform, css => "style", js => 'js/model' }, { layout => "xml" };
};

post "/save" => $save;
get "/save" => $save;

get "/expr" => sub {
	template "expr.tt";
};

true;
