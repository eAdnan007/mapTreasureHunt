<!DOCTYPE html>
<html>
    <head>
        <title>@yield( 'title' ) - {{ config('app.title') }}</title>

        <link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">
        <link href="{{ asset('asset/css/app.css') }}" rel="stylesheet" type="text/css">
        
        @section('scripts')
        <!-- jQuery -->
        <script src="{{ asset('asset/js/jquery.min.js') }}"></script>

        <!-- Bootstrap JS -->
        <script src="{{ asset('asset/js/bootstrap.min.js') }}"></script>

        <!-- Main JS -->
        <script src="{{ asset('asset/js/app.js') }}"></script>
        @show

    </head>
    <body>
        <nav class="navbar navbar-default navbar-static-top  navbar-inverse">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#primary-navigation" aria-expanded="false">
                        <span class="sr-only">{{ trans('toggle_nav') }}</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="{{ config('app.url') }}">
                        <img src="{{ asset('asset/images/th-logo.png') }}" alt="{{ config('app.title') }}" class="logo">
                    </a>
                </div>
                <div class="collapse navbar-collapse" id="primary-navigation">
                    <ul class="nav navbar-nav">
                        <li class="{{active_class('home')}}"><a href="{{ route('home') }}">{{ trans('pages.home') }}</a></li>
                        <li class="{{active_class('game')}}"><a href="{{ route('game') }}">{{ trans('pages.game') }}</a></li>
                        <li class="{{active_class('ranklist')}}"><a href="{{ route('ranklist') }}">{{ trans( 'pages.ranklist' ) }}</a></li>
                        <li class="{{active_class('help')}}"><a href="{{ route('help') }}">{{ trans( 'pages.help' ) }}</a></li>
                    </ul>
                    @if(Auth::check())
                        <ul class="nav navbar-nav navbar-right">
                            <li><a href="{{ url('/logout') }}">{{ trans('auth.logout') }}</a></li>
                        </ul>
                    @else
                        @include('auth-action')
                    @endif
                </div>
            </div>
        </nav>
        <div class="wrapper content">
        @yield( 'content' )
        </div>
    </body>
</html>
