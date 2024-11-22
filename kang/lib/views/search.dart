import 'dart:developer';
import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_map_location_marker/flutter_map_location_marker.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kang/constants/const.dart';
import 'package:kang/repos/test_repo.dart';
import 'package:latlong2/latlong.dart';

@RoutePage()
class SearchPage extends ConsumerStatefulWidget {
  LatLng? position;

  SearchPage({super.key, required this.position});

  @override
  _SearchPageState createState() => _SearchPageState();
}

class _SearchPageState extends ConsumerState<SearchPage> {
  double mapSize = 1;

  @override
  Widget build(BuildContext context) {
    final call = ref.watch(imageServiceProvider(widget.position!));
    final text = ref.watch(apiServiceProvider(widget.position!));
    return Material(
      child: Scaffold(
        appBar: AppBar(
          title: Text('Weather Details'),
          leading: IconButton(
            icon: Icon(Icons.arrow_back),
            onPressed: () {
              context.router.pop();
            },
          ),
        ),
        body: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Expanded(
              child: Center(
                child: call.when(
                  data: (test) {
                    return FlutterMap(
                      options: MapOptions(initialCenter: widget.position!, minZoom: 11.5),
                      children: [
                        TileLayer(
                          urlTemplate:
                              'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                          userAgentPackageName: 'com.example.app',
                        ),
                        CurrentLocationLayer(),
                        OverlayImageLayer(
                          overlayImages: [
                            OverlayImage(
                                opacity: 0.74,
                                bounds: LatLngBounds(
                                    LatLng(widget.position!.latitude + 0.1,
                                        widget.position!.longitude - 0.1),
                                    LatLng(widget.position!.latitude - 0.1,
                                        widget.position!.longitude + 0.1)),
                                imageProvider: MemoryImage(test!, scale: 20))
                          ],
                        )
                      ],
                    );
                  },
                  error: (err, stactrace) {
                    return Container(
                      child: Text(err.toString()),
                    );
                  },
                  loading: () => CircularProgressIndicator(),
                ),
              ),
            ),
            Container(
              height: MediaQuery.of(context).size.height * 0.3,
              width: MediaQuery.of(context).size.width,
              padding: EdgeInsets.all(20),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10),
                color: Colors.grey[200],
              ),
              child: text.when(
                data: ((data) {
                  return SizedBox(
                    child: SingleChildScrollView(
                      scrollDirection: Axis.vertical,
                      child: Text(
                        data.greeting!,
                        style: TextStyle(fontSize: 16),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  );
                }),
                error: (err, stactrace) {
                  return Container(
                    child: Text(err.toString()),
                  );
                },
                loading: () {
                  return Center(child: CircularProgressIndicator());
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
