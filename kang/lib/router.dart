import 'package:auto_route/auto_route.dart';
import 'package:flutter/widgets.dart';
import 'package:kang/views/homepage.dart';
import 'package:kang/views/otp.dart';
import 'package:kang/views/search.dart';
import 'package:kang/views/profile.dart';
import 'package:kang/views/start.dart';
import 'package:kang/views/DisplayPage.dart';
import 'package:latlong2/latlong.dart';
import 'package:kang/views/login.dart';
import 'package:kang/views/signup.dart';
part 'router.gr.dart';

@AutoRouterConfig()
class AutoRouter extends _$AutoRouter {
  @override
  List<AutoRoute> get routes => [
    AutoRoute(page: LoginRoute.page, path: "/", initial: true),
    AutoRoute(page: SearchRoute.page, path: "/search"),
    AutoRoute(page: SignupRoute.page, path: "/signup"),
    AutoRoute(page: OtpRoute.page, path: "/otp"),
    AutoRoute(page: DisplayRoute.page, path: "/displayImage"),
    AutoRoute(page: ProfileRoute.page, path: "/profile"),
    AutoRoute(page: MyAppRoute.page, path: "/startup"),
    AutoRoute(page: HomeRoute.page, path: "/home"),
  ];
}
