
# server/views.py  (drop-in replacement)
from urllib import request
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from server.models import *
import json
from django.db.models import F, Sum, Count
from django.utils import timezone
from datetime import timedelta
from collections import defaultdict

from django.conf import settings

from django.core.mail import send_mail



@csrf_exempt
def District(request):
    if request.method == 'POST':
        tbl_district.objects.create(
                       district_name=request.POST['district_name'])
        return JsonResponse({'msg': "Instert SuccessFully"})
    else:
        data = list(tbl_district.objects.values())
        return JsonResponse({'data': data})
    
@csrf_exempt
def DeleteDistrict(request, did):
    tbl_district.objects.get(id=did).delete()
    return JsonResponse({'data': list(tbl_district.objects.values())})

@csrf_exempt
def EditDistrict(request, did):
    if request.method == 'PUT':
        
        tbl_district.objects.filter(id=did).update(district_name=json.loads(request.body)['district_name'])
    return JsonResponse({'data': list(tbl_district.objects.values())})

@csrf_exempt
def Admin(request):
    if request.method == 'POST':
        tbl_admin.objects.create(
            admin_id=request.POST['admin_id'],
            admin_name=request.POST['admin_name'],
            admin_email=request.POST['admin_email'],
            admin_password=request.POST['admin_password']
        )
        return JsonResponse({'msg': "Admin Registered Successfully"})
    else:
        data = list(tbl_admin.objects.values())
        return JsonResponse({'data': data})

@csrf_exempt
def DeleteAdmin(request, aid):
    tbl_admin.objects.get(id=aid).delete()
    return JsonResponse({'data': list(tbl_admin.objects.values())})

@csrf_exempt
def City(request):
    if request.method == 'POST':
        tbl_city.objects.create(
            city_name=request.POST['city_name'],
            district_id= tbl_district.objects.get(id=request.POST['district_id'])
        )
        return JsonResponse({'msg': "City Added Successfully"})
    else:
        data = list(tbl_city.objects.values())
        return JsonResponse({'data': data})
    
@csrf_exempt
def EditCity(request, cid):
    if request.method == 'PUT':
        
        tbl_city.objects.filter(id=cid).update(city_name=json.loads(request.body)['city_name'])
    return JsonResponse({'data': list(tbl_city.objects.values())})



@csrf_exempt
def CityByDistrict(request, district_id):
    data = list(tbl_city.objects.filter(district_id=district_id).values())
    return JsonResponse({'data': data})




@csrf_exempt
def DeleteCity(request, cid):
    tbl_city.objects.get(id=cid).delete()
    return JsonResponse({'data': list(tbl_city.objects.values())})

@csrf_exempt
def Theater(request):
    if request.method == 'POST':
        tbl_theater.objects.create(
            theater_name=request.POST['theater_name'],
            theater_email=request.POST['theater_email'],
            theater_contact=request.POST['theater_contact'],
            theater_photo=request.FILES.get('theater_photo'),
            theater_proof=request.FILES.get('theater_proof'),
            city_id= tbl_city.objects.get(id=request.POST['city_id']),
            theater_password=request.POST['theater_password']
        )
        return JsonResponse({'msg': "Theater Added Successfully"})
    else:
        data = list(tbl_theater.objects.values())
        return JsonResponse({'data': data}) 
    
@csrf_exempt
def DeleteTheater(request, tid):
    tbl_theater.objects.get(id=tid).delete()
    return JsonResponse({'data': list(tbl_theater.objects.values())})

@csrf_exempt
def User(request):
    if request.method == 'POST':
        tbl_user.objects.create(
            user_name=request.POST['user_name'],
            user_email=request.POST['user_email'],
            user_password=request.POST['user_password'],
            user_contact=request.POST['user_contact'],
            city_id= tbl_city.objects.get(id=request.POST['city_id'])
        )
        return JsonResponse({'msg': "User Registered Successfully"})
    else:
        data = list(tbl_user.objects.values())
        return JsonResponse({'data': data})
@csrf_exempt
def DeleteUser(request, uid):
    tbl_user.objects.get(id=uid).delete()
    return JsonResponse({'data': list(tbl_user.objects.values())})

@csrf_exempt
def Booking(request):

    if request.method == 'POST':

        user = tbl_user.objects.get(id=request.POST['user_id'])
        movie = tbl_movie.objects.get(id=request.POST['movie_id'])

        booking = tbl_booking.objects.create(
            user_id=user,
            movie_id=movie,
            booking_amount=request.POST['booking_amount'],
            booking_todate=request.POST['booking_date'],
            booking_time=request.POST['booking_time'],
            booking_status=request.POST.get('booking_status', 0)
        )

        # Email content
       

        return JsonResponse({
            "msg": "Booking Successful",
            "booking_id": booking.id
        })
    
@csrf_exempt
def DeleteBooking(request, bid):
    tbl_booking.objects.get(id=bid).delete()
    return JsonResponse({'data': list(tbl_booking.objects.values())})    

@csrf_exempt
def Genre(request):
    if request.method == 'POST':
        tbl_genre.objects.create(
            genre_name=request.POST['genre_name']
        )
        return JsonResponse({'msg': "Genre Added Successfully"})
    else:
        data = list(tbl_genre.objects.values())
        return JsonResponse({'data': data})
    
@csrf_exempt
def DeleteGenre(request, gid):
    tbl_genre.objects.get(id=gid).delete()
    return JsonResponse({'data': list(tbl_genre.objects.values())}) 

@csrf_exempt
def EditGenre(request, gid):
    if request.method == 'PUT':
        
        tbl_genre.objects.filter(id=gid).update(genre_name=json.loads(request.body)['genre_name'])
    return JsonResponse({'data': list(tbl_genre.objects.values())})
    
@csrf_exempt
def Trailer(request):
    if request.method == 'POST':
        tbl_trailer.objects.create(
            trailer_file=request.POST['trailer_file'],
            trailer_description=request.POST['trailer_description']
        )
        return JsonResponse({'msg': "Trailer Added Successfully"})
    else:
        data = list(tbl_trailer.objects.values())
        return JsonResponse({'data': data})
    
@csrf_exempt
def DeleteTrailer(request, trid):
    tbl_trailer.objects.get(id=trid).delete()
    return JsonResponse({'data': list(tbl_trailer.objects.values())})    

@csrf_exempt
def Review(request):

   if request.method == "POST":

        data = json.loads(request.body)

        user_id = data.get("user_id")
        movie_id = data.get("movie_id")
        rating = data.get("review_rating")
        review = data.get("review_content")

        user = tbl_user.objects.get(id=user_id)
        movie = tbl_movie.objects.get(id=movie_id)

        tbl_review.objects.create(
            user_id=user,
            movie_id=movie,
            review_content=review,
            review_rating=rating
        )

        return JsonResponse({"msg": "Review Added Successfully"})
   else:
        return JsonResponse({"msg": "Invalid request"})

@csrf_exempt
def DeleteReview(request, reid):
    tbl_review.objects.get(id=reid).delete()
    return JsonResponse({'data': list(tbl_review.objects.values())})    
    
@csrf_exempt
def Screentype(request):
    if request.method == 'POST':
        tbl_screentype.objects.create(
            screentype_name=request.POST['screentype_name']
        )
        return JsonResponse({'msg': "Screen Type Added Successfully"})
    else:
        data = list(tbl_screentype.objects.values())
        return JsonResponse({'data': data})    
    
@csrf_exempt
def DeleteScreentype(request, stid):
    tbl_screentype.objects.get(id=stid).delete()
    return JsonResponse({'data': list(tbl_screentype.objects.values())})  
  
@csrf_exempt
def EditScreentype(request, stid):
    if request.method == 'PUT':
        
        tbl_screentype.objects.filter(id=stid).update(screentype_name=json.loads(request.body)['screentype_name'])
    return JsonResponse({'data': list(tbl_screentype.objects.values())})
    
@csrf_exempt
def Complaint(request):
    if request.method == 'POST':
        tbl_complaint.objects.create(
            user_id=tbl_user.objects.get(id=request.POST['user_id']),
            theater_id=tbl_theater.objects.get(id=request.POST['theater_id']),
            complaint_title=request.POST['complaint_title'],
            complaint_reply=request.POST['complaint_reply'],
            complaint_date=request.POST['complaint_date'],
           
        )
        return JsonResponse({'msg': "Complaint Submitted Successfully"})
    else:
        data = list(tbl_complaint.objects.values())
        return JsonResponse({'data': data})
    
@csrf_exempt
def DeleteComplaint(request, cid):
    tbl_complaint.objects.get(id=cid).delete()
    return JsonResponse({'data': list(tbl_complaint.objects.values())})    
    
@csrf_exempt
def Theatermovie(request):
    if request.method == 'POST':
        tbl_theatermovie.objects.create(
            theater_id=tbl_theater.objects.get(id=request.POST['theater_id']),
            movie_id=tbl_movie.objects.get(id=request.POST['movie_id']),
        )
        return JsonResponse({'msg': "Movie Added Successfully"})
    else:
        data = list(tbl_theatermovie.objects.values())
        return JsonResponse({'data': data})
    
@csrf_exempt
def DeleteTheatermovie(request, tmid):
    tbl_theatermovie.objects.get(id=tmid).delete()
    return JsonResponse({'data': list(tbl_theatermovie.objects.values())})    

@csrf_exempt
def Movie(request):

    if request.method == 'POST':

        tbl_movie.objects.create(
            movie_title=request.POST['movie_title'],
            movie_description=request.POST['movie_description'],
            movie_duration=request.POST['movie_duration'],
            movie_language=request.POST['movie_language'],
            movie_poster=request.FILES['movie_poster'],
            movie_banner=request.FILES['movie_banner'],
            movie_genre=request.POST.get('movie_genre'),
            movie_release_date=request.POST.get('movie_release_date'),
            movie_trailer=request.POST.get('movie_trailer'),
            movie_rating=request.POST.get('movie_rating'),
        )

        return JsonResponse({'msg': "Movie Added Successfully"})

    else:
        movie = list(tbl_movie.objects.all())
        data = []

        for m in movie:

            badge = None

            # -------- NEW (released within 7 days) --------
            if m.movie_release_date:
                if m.movie_release_date >= timezone.now().date() - timedelta(days=3):
                    badge = "New"

            # -------- TOP (rating >= 8) --------
            if m.movie_rating and float(m.movie_rating) >= 9:
                badge = "Top"

            # -------- TRENDING (most bookings) --------
            bookings = tbl_booking.objects.filter(movie_id=m).count()

            if bookings >= 4:
                badge = "Trending"

            # -------- HOT (many reviews) --------
            reviews = tbl_review.objects.filter(movie_id=m).count()

            if reviews >= 4:
                badge = "Hot"

            data.append({
                "id": m.id,
                "movie_title": m.movie_title,
                "movie_description": m.movie_description,
                "movie_duration": m.movie_duration,
                "movie_language": m.movie_language,
                "movie_genre": m.movie_genre,
                "movie_release_date": m.movie_release_date,
                "movie_trailer": m.movie_trailer,
                "movie_rating": m.movie_rating,
                "movie_poster": m.movie_poster.url if m.movie_poster else "",
                "movie_banner": m.movie_banner.url if m.movie_banner else "",
                "badge": badge
            })

    
        return JsonResponse({'data': data})
    
@csrf_exempt
def DeleteMovie(request, mid):
    tbl_movie.objects.get(id=mid).delete()
    return JsonResponse({'data': list(tbl_movie.objects.values())})    

@csrf_exempt
def Screen(request):
    if request.method == 'POST':
        tbl_screen.objects.create(
            theater_id=tbl_theater.objects.get(id=request.POST['theater_id']),
            screentype_id=tbl_screentype.objects.get(id=request.POST['screentype_id']),
            screen_seatno=request.POST['screen_seatno'],
            Screen_name=request.POST['screen_name']            
        )
        return JsonResponse({'msg': "Screen Added Successfully"})
    else:
        data = list(tbl_screen.objects.values(
            *[f.name for f in tbl_screen._meta.fields],
            screentype_name=F('screentype_id__screentype_name')
            ))
        return JsonResponse({'data': data})
    
    
@csrf_exempt
def Screenview(request, theater_id):
        data = list(tbl_screen.objects.filter(theater_id=theater_id).values(
            *[f.name for f in tbl_screen._meta.fields],
            screentype_name=F('screentype_id__screentype_name')
        ))
        return JsonResponse({'data': data})

         
   
    
@csrf_exempt
def DeleteScreen(request, sid):
    tbl_screen.objects.get(id=sid).delete()
    return JsonResponse({'data': list(tbl_screen.objects.values())})    


@csrf_exempt
def Shows(request):
    if request.method == "POST":
        movie_id = tbl_movie.objects.get(id=request.POST.get("movie_id"))
        screen_id = tbl_screen.objects.get(id=request.POST.get("screen_id"))
        showdate = request.POST.get("showdate")
        showtime = request.POST.get("showtime")

        tbl_shows.objects.create(
            movie_id=movie_id,
            screen_id=screen_id,
            showdate=showdate,
            showtime=showtime
        )

        return JsonResponse({"msg": "Show Added Successfully"})
    
@csrf_exempt
def DeleteShows(request, shid):
    tbl_shows.objects.get(id=shid).delete()
    return JsonResponse({'data': list(tbl_shows.objects.values())})    



def UserShows(request, movie_id, theater_id):

    shows = tbl_shows.objects.filter(
        movie_id=movie_id,
        screen_id__theater_id=theater_id
    ).values(
        'id',
        'showdate',
        'showtime',
        'screen_id',
        'screen_id__Screen_name',
        'screen_id__theater_id',
        'screen_id__theater_id__theater_name'
    )

    data = []

    for s in shows:
        data.append({
            "id": s["id"],
            "showdate": s["showdate"],
            "showtime": s["showtime"],
            "screen": s["screen_id__Screen_name"],
            "screen_id": s["screen_id"],
            "theater": s["screen_id__theater_id__theater_name"],
            "theater_id": s["screen_id__theater_id"]
        })

    return JsonResponse({"data": data})

@csrf_exempt
def ScreenSeat(request):

    if request.method == 'POST':

        tbl_screenseat.objects.create(
            screen_id=tbl_screen.objects.get(id=request.POST['screen_id']),
            seattype_id=tbl_seattype.objects.get(id=request.POST['seattype_id']),
            rows=request.POST['rows'],
            columns=request.POST['columns'],
            aisles=request.POST.get('aisles', ''),
            screenseat_total=request.POST['screenseat_total'],
            screenseat_amountper=request.POST['screenseat_amountper']
        )

        return JsonResponse({'msg': "Layout Saved Successfully"})

    else:

        data = tbl_screenseat.objects.select_related(
            'screen_id', 'seattype_id'
        ).values(
            'id',
            'rows',
            'columns',
            'aisles',
            'screenseat_total',
            'screenseat_amountper',
            'screen_id__Screen_name',
            'seattype_id__seattype_name'
        )

        return JsonResponse({'data': list(data)})
    
@csrf_exempt
def ScreenSeatview(request, theater_id):


        data = tbl_screenseat.objects.filter(screen_id__theater_id=theater_id).select_related(
            'screen_id', 'seattype_id'
        ).values(
            'id',
            'rows',
            'columns',
            'aisles',
            'screenseat_total',
            'screenseat_amountper',
            'screen_id__Screen_name',
            'seattype_id__seattype_name'
        )

        return JsonResponse({'data': list(data)})

@csrf_exempt
def DeleteScreenSeat(request, ssid):
    tbl_screenseat.objects.get(id=ssid).delete()
    return JsonResponse({'data': list(tbl_screenseat.objects.values())})
    
# @csrf_exempt
# def SeatBooking(request):

#     if request.method == 'POST':

#         screenseat_id = request.POST['screenseat_id']
#         seat_number = request.POST['seatbooking_number']
#         booking_id = request.POST['booking_id']

#         exists = tbl_seatbooking.objects.filter(
#             screenseat_id=screenseat_id,
#             seatbooking_number=seat_number
#         ).exists()

#         if exists:
#             return JsonResponse({'msg': 'Seat already booked'}, status=400)

#         tbl_seatbooking.objects.create(
#             screenseat_id=tbl_screenseat.objects.get(id=screenseat_id),
#             seatbooking_number=seat_number,
#             booking_id=tbl_booking.objects.get(id=booking_id)
#         )

#         return JsonResponse({'msg': "Seat Booking Successful"})
#     else:
#         data = list(tbl_seatbooking.objects.values())
#         return JsonResponse({'data': data})


@csrf_exempt
def SeatBooking(request):
    if request.method == 'POST':

        screenseat_id = request.POST['screenseat_id']   # layout id
        seat_number   = request.POST['seatbooking_number']
        booking_id    = request.POST['booking_id']

        booking = tbl_booking.objects.get(id=booking_id)

        # ✅ check seat only for SAME movie + SAME time + SAME date + SAME screen seat
        exists = tbl_seatbooking.objects.filter(
            screenseat_id=screenseat_id,
            seatbooking_number=seat_number,
            booking_id__movie_id=booking.movie_id,
            booking_id__booking_time=booking.booking_time,
            booking_id__booking_todate=booking.booking_todate,
            booking_id__booking_status__in=[ 1],   # created or paid
        ).exists()

        if exists:
            return JsonResponse({'msg': f'Seat {seat_number} already booked'}, status=400)

        tbl_seatbooking.objects.create(
            screenseat_id=tbl_screenseat.objects.get(id=screenseat_id),
            seatbooking_number=seat_number,
            booking_id=booking
        )

        return JsonResponse({'msg': "Seat Booking Successful"})

    else:
        data = list(tbl_seatbooking.objects.values())
        return JsonResponse({'data': data})
    
@csrf_exempt
def DeleteSeatBooking(request, sbid):
    tbl_seatbooking.objects.get(id=sbid).delete()
    return JsonResponse({'data': list(tbl_seatbooking.objects.values())})

@csrf_exempt
def Feedback(request):
    if request.method == 'POST':
        tbl_feedback.objects.create(
            user_id=tbl_user.objects.get(id=request.POST['user_id']),
            feedback_content=request.POST['feedback_content'],
            feedback_date=request.POST['feedback_date']
         )
        return JsonResponse({'msg': "Feedback Submitted Successfully"})
    else:
        data = list(tbl_feedback.objects.values())
        return JsonResponse({'data': data}) 

@csrf_exempt
def DeleteFeedback(request, fid):
    tbl_feedback.objects.get(id=fid).delete()
    return JsonResponse({'data': list(tbl_feedback.objects.values())})

@csrf_exempt
def SeatType(request):
    if request.method == 'POST':
        tbl_seattype.objects.create(        
            seattype_name=request.POST['seattype_name']
         )
        return JsonResponse({'msg': "Seat Type Added Successfully"})
    else:
        data = list(tbl_seattype.objects.values())
        return JsonResponse({'data': data})   

@csrf_exempt
def DeleteSeatType(request, stid):
    tbl_seattype.objects.get(id=stid).delete()
    return JsonResponse({'data': list(tbl_seattype.objects.values())})   

@csrf_exempt
def EditSeatType(request, stid):
    if request.method == 'PUT':
        
        tbl_seattype.objects.filter(id=stid).update(seattype_name=json.loads(request.body)['seattype_name'])
    return JsonResponse({'data': list(tbl_seattype.objects.values())})

@csrf_exempt
def Login(request):

    if request.method == 'POST':

        body = json.loads(request.body)

        email = body.get('email')
        password = body.get('password')

        user = tbl_user.objects.filter(
            user_email=email,
            user_password=password
        ).first()

        admin = tbl_admin.objects.filter(
            admin_email=email,
            admin_password=password
        ).first()

        theater = tbl_theater.objects.filter(
            theater_email=email,
            theater_password=password
        ).first()

        # -------- USER LOGIN --------
        if user:
            return JsonResponse({
                'role': 'user',
                'id': user.id,
                'name': user.user_name,
                'message': 'Login successful'
            })

        # -------- ADMIN LOGIN --------
        elif admin:
            return JsonResponse({
                'role': 'admin',
                'id': admin.id,
                'name': admin.admin_name,
                'message': 'Login successful'
            })

        # -------- THEATRE LOGIN --------
        elif theater:

            if theater.theater_status == 0:
                return JsonResponse({
                    'message': 'Your theatre account is waiting for admin approval'
                })

            if theater.theater_status == 2:
                return JsonResponse({
                    'message': 'Your theatre account was rejected by admin'
                })

            return JsonResponse({
                'role': 'theater',
                'id': theater.id,
                'name': theater.theater_name,
                'message': 'Login successful'
            })

        else:
            return JsonResponse({
                'message': 'Invalid email or password'
            }, status=401)

    return JsonResponse({
        'error': 'Method not allowed'
    }, status=405)

   
@csrf_exempt
def theaterprofile(request, id):
    if request.method == 'GET':

        theater = tbl_theater.objects.get(id=id)
        return JsonResponse({
            'theater_name': theater.theater_name,
            'theater_email': theater.theater_email,
            'theater_contact': theater.theater_contact,
            'city_id': theater.city_id.city_name,
            'district_id': theater.city_id.district_id.district_name,
           
        })
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
@csrf_exempt
def theatereditprofile(request, id):
    if request.method == 'GET':

        theater = tbl_theater.objects.get(id=id)
        return JsonResponse({
            'theater_name': theater.theater_name,
            'theater_email': theater.theater_email, 
            'theater_contact': theater.theater_contact,
              
        })
    
    if request.method == 'PUT':
        body = json.loads(request.body)
        theater_name = body.get('theater_name')
        theater_email = body.get('theater_email')
        theater_contact = body.get('theater_contact')
     

        theater = tbl_theater.objects.get(id=id)
        theater.theater_name = theater_name
        theater.theater_email = theater_email
        theater.theater_contact = theater_contact
       
        theater.save()
        return JsonResponse({'message': 'Profile updated successfully'})
    
@csrf_exempt
def changepassword(request, id):
    if request.method == 'PUT':
        body = json.loads(request.body)
        old_password = body.get('old_password')
        new_password = body.get('new_password')
        confirm_password = body.get('confirm_password')
        theater = tbl_theater.objects.get(id=id)

        if theater.theater_password == old_password:
            if new_password != confirm_password:
                theater.theater_password = new_password
                theater.save()
                return JsonResponse({'message': 'Password changed successfully'})
            else:
                return JsonResponse({'message': 'New password and confirm password do not match'}, status=400)
        else:
            return JsonResponse({'message': 'Old password is incorrect'}, status=400)

@csrf_exempt
def MovieDetails(request, mid):
    if request.method == 'GET':
        movie = tbl_movie.objects.filter(id=mid).values().first()
        return JsonResponse(movie)
    
@csrf_exempt
def userprofile(request, id):
    if request.method == 'GET':

        user = tbl_user.objects.get(id=id)
        return JsonResponse({
            'user_name':user.user_name,
            'user_email': user.user_email,
            'user_contact': user.user_contact,
            'user_password': user.user_password,
           
        })
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
@csrf_exempt
def usereditprofile(request, id):
    if request.method == 'GET':

        user = tbl_user.objects.get(id=id)
        return JsonResponse({
            'user_name':user.user_name,
            'user_email': user.user_email,
            'user_contact': user.user_contact,
            'user_password': user.user_password,
           
        })
    
    if request.method == 'PUT':
        body = json.loads(request.body)
        user_name = body.get('user_name')
        user_email = body.get('user_email')
        user_contact = body.get('user_contact')
     

        user = tbl_user.objects.get(id=id)
        user.user_name = user_name
        user.user_email = user_email
        user.user_contact = user_contact
       
        user.save()
        return JsonResponse({'message': 'Profile updated successfully'})
    
@csrf_exempt
def userchangepassword(request, id):
    if request.method == 'PUT':
        body = json.loads(request.body)
        old_password = body.get('old_password')
        new_password = body.get('new_password')
        confirm_password = body.get('confirm_password')
        user = tbl_user.objects.get(id=id)

        if user.user_password == old_password:
            if new_password != confirm_password:
                user.user_password = new_password
                user.save()
                return JsonResponse({'message': 'Password changed successfully'})
            else:
                return JsonResponse({'message': 'New password and confirm password do not match'}, status=400)
        else:
            return JsonResponse({'message': 'Old password is incorrect'}, status=400)

@csrf_exempt
def MovieTheatersWithShows(request, mid):

    shows = tbl_shows.objects.filter(movie_id=mid).values(
        'showtime',
        'showdate',
        theater_id=F('screen_id__theater_id__id'),
        theater_name=F('screen_id__theater_id__theater_name'),
        city_name=F('screen_id__theater_id__city_id__city_name')
    )

    theater_dict = defaultdict(list)

    for show in shows:

        key = (
            show['theater_id'],
            show['theater_name'],
            show['city_name']
        )

        theater_dict[key].append(show['showtime'])

    result = []

    for (tid, tname, city), times in theater_dict.items():

        result.append({
            "theater_id": tid,
            "theater_name": tname,
            "city_name": city,
            "showtimes": times,
            "movieId": mid
        })

    return JsonResponse({"data": result})

@csrf_exempt
def viewseat(request, sid):

    layouts = tbl_screenseat.objects.filter(
        screen_id=sid
    ).select_related('seattype_id')

    data = []

    for layout in layouts:
        data.append({
            "layout_id": layout.id,
            "seat_type": layout.seattype_id.seattype_name,
            "rows": layout.rows,
            "columns": layout.columns,
            "aisles": layout.aisles,
            "price": layout.screenseat_amountper
        })

    return JsonResponse({"data": data})
    
@csrf_exempt
def BookedSeats(request, screen_id):

    booked = tbl_seatbooking.objects.filter(
        screenseat_id__screen_id=screen_id
    ).values_list('seatbooking_number', flat=True)

    return JsonResponse({'bookedSeats': list(booked)})




@csrf_exempt
def make_payment(request, booking_id):

    if request.method == "PUT":
        try:
            booking = tbl_booking.objects.select_related(
                "user_id",
                "movie_id"
            ).get(id=booking_id)

            if booking.booking_status == 1:
                return JsonResponse({"msg": "Booking already paid"}, status=400)

            if booking.booking_status == 2:
                return JsonResponse({"msg": "Booking cancelled"}, status=400)

            booking.booking_status = 1
            booking.save()

            user = booking.user_id
            movie = booking.movie_id

            # Get seats
            seat_bookings = tbl_seatbooking.objects.filter(booking_id=booking)

            seat_numbers = []
            for seat in seat_bookings:
                seat_numbers.append(seat.seatbooking_number)

            seat_list = ", ".join(seat_numbers)

            # Booking ID
            ticket_id = f"TSW-{booking.id * booking.id}"

            subject = "Movie Ticket Booking Confirmation"

            message = f"""
Hello {user.user_name},

Your movie ticket booking has been confirmed.

---------------------------------------
BOOKING DETAILS
---------------------------------------

Booking ID : {ticket_id}

Movie      : {movie.movie_title}
Date       : {booking.booking_todate}
Time       : {booking.booking_time}

Seats      : {seat_list}

Total Paid : ₹{booking.booking_amount}

---------------------------------------

Please arrive at the theatre at least 15 minutes before the show.

Enjoy your movie!

THE TIME SHOW
"""

            send_mail(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                [user.user_email],
                fail_silently=False,
            )

            return JsonResponse({
                "msg": "Payment Successful",
                "booking_id": booking.id,
                "status": booking.booking_status
            })

        except tbl_booking.DoesNotExist:
            return JsonResponse({"msg": "Booking not found"}, status=404)

    return JsonResponse({"error": "Invalid request"}, status=400)

@csrf_exempt
def booking_details(request, booking_id):

    try:
        booking = tbl_booking.objects.get(id=booking_id)

        seats = tbl_seatbooking.objects.filter(
            booking_id=booking
        ).values_list('seatbooking_number', flat=True)

        show = tbl_shows.objects.filter(
            movie_id=booking.movie_id
        ).first()

        screen = show.screen_id if show else None
        theater = screen.theater_id if screen else None

        return JsonResponse({
            "booking_id": booking.id,
            "movie": booking.movie_id.movie_title if booking.movie_id else "",
            "movie_poster": booking.movie_id.movie_poster.url if booking.movie_id and booking.movie_id.movie_poster else "",
            "theatre": theater.theater_name if theater else "",
            "screen": screen.Screen_name if screen else "",
            "seats": list(seats),
            "amount": booking.booking_amount,
            "booking_todate": booking.booking_todate,
            "booking_time": booking.booking_time,
            "user_name": booking.user_id.user_name if booking.user_id else ""
        })

    except tbl_booking.DoesNotExist:
        return JsonResponse({"msg": "Booking not found"}, status=404)


@csrf_exempt

def MyBookings(request, user_id):

    bookings = tbl_booking.objects.filter(
        user_id=user_id,
        booking_status=1
    ).values(
        'id',
        'movie_id',
        'booking_amount',
        'booking_todate',
        'booking_time',
        'booking_status',
        movie_title=F('movie_id__movie_title'),
        movie_poster=F('movie_id__movie_poster')
    )

    data = list(bookings)

    for b in data:
        seats = tbl_seatbooking.objects.filter(
            booking_id=b['id']
        ).values_list('seatbooking_number', flat=True)

        b['seats'] = list(seats)

    return JsonResponse({'data': data})

@csrf_exempt
def BookedSeatsForShow(request, screen_id, movie_id, show_time):

    booked = tbl_seatbooking.objects.filter(
        screenseat_id__screen_id=screen_id,
        booking_id__movie_id=movie_id,
        booking_id__booking_time=show_time,
        booking_id__booking_status__in=[1]   # pending + paid
    ).values_list("screenseat_id", "seatbooking_number")

    booked_keys = [
        f"{layout}-{seat}"
        for layout, seat in booked
    ]

    return JsonResponse({
        "bookedSeats": booked_keys
    })

@csrf_exempt
def CitySearch(request):

    q = request.GET.get('q','')

    cities = tbl_city.objects.filter(
        city_name__icontains=q
    ).values(
        'id',
        'city_name'
    )[:10]

    return JsonResponse({"data": list(cities)})
@csrf_exempt
def MovieReviews(request, movie_id):

    reviews = tbl_review.objects.filter(movie_id=movie_id).values(
        'review_content',
        'review_rating',
        user_name=F('user_id__user_name')
    ).order_by('-id')[:10]

    return JsonResponse({"data": list(reviews)})







@csrf_exempt
def AdminDashboard(request):

    revenue = tbl_booking.objects.filter(
        booking_status=1
    ).aggregate(total=Sum("booking_amount"))["total"] or 0

    bookings = tbl_booking.objects.count()
    users = tbl_user.objects.count()
    movies = tbl_movie.objects.count()

    stats = {
        "revenue": revenue,
        "bookings": bookings,
        "users": users,
        "movies": movies
    }

    # ---------------- RECENT BOOKINGS ----------------

    recent = tbl_booking.objects.select_related(
        "user_id",
        "movie_id"
    ).values(
        "id",
        user=F("user_id__user_name"),
        movie=F("movie_id__movie_title"),
        amount=F("booking_amount"),
        status=F("booking_status"),
        time=F("booking_time")
    ).order_by("-id")[:6]

    recentBookings = []

    for r in recent:

        status = "Pending"

        if r["status"] == 1:
            status = "Paid"

        if r["status"] == 2:
            status = "Cancelled"

        recentBookings.append({
            "id": f"TSW-{r['id']}",
            "user": r["user"],
            "movie": r["movie"],
            "amount": r["amount"],
            "status": status,
            "time": r["time"]
        })

    # ---------------- TOP MOVIES ----------------

    movieStats = tbl_booking.objects.values(
        title=F("movie_id__movie_title")
    ).annotate(
        bookings=Count("id"),
        revenue=Sum("booking_amount")
    ).order_by("-bookings")[:5]

    topMovies = []

    for m in movieStats:

        topMovies.append({
            "title": m["title"],
            "bookings": m["bookings"],
            "revenue": m["revenue"]
        })

    # ---------------- GENRES ----------------

    genreData = tbl_movie.objects.values("movie_genre").annotate(
        count=Count("id")
    )

    genres = []

    for g in genreData:

        genres.append({
            "name": g["movie_genre"],
            "count": g["count"]
        })

    # ---------------- CITIES ----------------

    cityData = tbl_city.objects.all()

    cities = []

    for c in cityData:

        screens = tbl_screen.objects.filter(
            theater_id__city_id=c.id
        ).count()

        bookings = tbl_booking.objects.filter(
            user_id__city_id=c.id
        ).count()

        cities.append({
            "name": c.city_name,
            "screens": screens,
            "bookings": bookings
        })

    # ---------------- RESPONSE ----------------

    return JsonResponse({
        "stats": stats,
        "recentBookings": recentBookings,
        "topMovies": topMovies,
        "genres": genres,
        "cities": cities
    })






@csrf_exempt
def TheatreDashboard(request):

    revenue = tbl_booking.objects.filter(
        booking_status=1
    ).aggregate(total=Sum("booking_amount"))["total"] or 0

    shows = tbl_shows.objects.count()

    bookings = tbl_booking.objects.count()

    screens = tbl_screen.objects.count()

    stats = {
        "revenue": revenue,
        "shows": shows,
        "bookings": bookings,
        "screens": screens
    }

    # ---------- RECENT BOOKINGS ----------

    recent = tbl_booking.objects.select_related(
        "user_id", "movie_id"
    ).values(
        "id",
        user=F("user_id__user_name"),
        movie=F("movie_id__movie_title"),
        amount=F("booking_amount"),
        status=F("booking_status"),
        time=F("booking_time")
    ).order_by("-id")[:6]

    recentBookings = []

    for r in recent:

        status = "Pending"

        if r["status"] == 1:
            status = "Paid"

        if r["status"] == 2:
            status = "Cancelled"

        recentBookings.append({
            "id": f"TH-{r['id']}",
            "user": r["user"],
            "movie": r["movie"],
            "amount": r["amount"],
            "status": status,
            "time": r["time"]
        })

    # ---------- TODAY SHOWS ----------

    from datetime import date

    today = date.today()

    showData = tbl_shows.objects.filter(showdate=today).select_related(
        "movie_id", "screen_id"
    )

    todayShows = []

    for s in showData:

        seats = tbl_screenseat.objects.filter(
            screen_id=s.screen_id
        ).aggregate(total=Sum("screenseat_total"))["total"] or 0

        booked = tbl_seatbooking.objects.filter(
            booking_id__movie_id=s.movie_id
        ).count()

        todayShows.append({
            "title": s.movie_id.movie_title,
            "time": s.showtime,
            "screen": s.screen_id.Screen_name,
            "booked": booked,
            "seats": seats,
            "format": "2D"
        })

    # ---------- TOP MOVIES ----------

    movieStats = tbl_booking.objects.values(
        title=F("movie_id__movie_title")
    ).annotate(
        bookings=Count("id"),
        revenue=Sum("booking_amount")
    ).order_by("-bookings")[:5]

    topMovies = []

    for m in movieStats:

        topMovies.append({
            "title": m["title"],
            "bookings": m["bookings"],
            "revenue": m["revenue"]
        })

    return JsonResponse({

        "stats": stats,
        "recentBookings": recentBookings,
        "todayShows": todayShows,
        "topMovies": topMovies

    })


@csrf_exempt
def AdminUsersTheatres(request):

    from_date = request.GET.get("from")
    to_date = request.GET.get("to")

    theatres = tbl_theater.objects.all()

    if from_date and to_date:
        theatres = theatres.filter(theater_date__range=[from_date, to_date])

    theatre_list = []

    for t in theatres:
        theatre_list.append({
            "id": t.id,
            "theater_name": t.theater_name,
            "theater_email": t.theater_email,
            "theater_contact": t.theater_contact,
            "city": t.city_id.city_name,
            "theater_status": t.theater_status
        })

    return JsonResponse({"theatres": theatre_list})

@csrf_exempt
def BookingList(request):

    bookings = tbl_booking.objects.select_related(
        "user_id",
        "movie_id"
    ).values(
        "id",
        user=F("user_id__user_name"),
        movie=F("movie_id__movie_title"),
        amount=F("booking_amount"),
        date=F("booking_todate"),
        status=F("booking_status")
    ).order_by("-id")

    data = []

    for b in bookings:

        status = "pending"

        if b["status"] == 1:
            status = "confirmed"

        if b["status"] == 2:
            status = "cancelled"

        seats = tbl_seatbooking.objects.filter(
            booking_id=b["id"]
        ).values_list("seatbooking_number", flat=True)

        data.append({
            "id": f"TKT-{b['id']}",
            "user": b["user"],
            "movie": b["movie"],
            "seats": ", ".join(seats),
            "amount": f"₹{b['amount']}",
            "date": b["date"],
            "status": status,
            "avatar": b["user"][:2].upper()
        })

    return JsonResponse({"data": data})

@csrf_exempt
def CleanupExpiredBookings(request):

    expiry_time = timezone.now() - timedelta(minutes=5)

    expired = tbl_booking.objects.filter(
        booking_status=0,
        created_at__lt=expiry_time
    )

    count = expired.count()

    # cancel bookings
    expired.update(booking_status=2)

    return JsonResponse({
        "msg": f"{count} expired bookings cancelled"
    })


@csrf_exempt
def PendingTheatres(request):

    theatres = tbl_theater.objects.filter(theater_status=0)

    data = []

    for t in theatres:
        data.append({
            "id": t.id,
            "theater_name": t.theater_name,
            "theater_email": t.theater_email,
            "theater_contact": t.theater_contact,
            "theater_photo": t.theater_photo.url if t.theater_photo else "",
            "theater_proof": t.theater_proof.url if t.theater_proof else "",
            "status": t.theater_status
        })

    return JsonResponse({"data": data})

@csrf_exempt
def ApproveTheatre(request, tid):

    theatre = tbl_theater.objects.get(id=tid)

    theatre.theater_status = 1
    theatre.save()

    return JsonResponse({
        "msg": "Theatre Approved"
    })


@csrf_exempt
def RejectTheatre(request, tid):

    theatre = tbl_theater.objects.get(id=tid)

    theatre.theater_status = 2
    theatre.save()

    return JsonResponse({
        "msg": "Theatre Rejected"
    })



@csrf_exempt
def CityTheatres(request, user_id):

    if request.method == "GET":

        try:
            user = tbl_user.objects.get(id=user_id)
            city = user.city_id

            theatres = tbl_theater.objects.filter(
                city_id=city,
                theater_status=1
            )

            data = []

            for t in theatres:
                data.append({
                    "theater_id": t.id,
                    "theater_name": t.theater_name,
                    "city_name": t.city_id.city_name,
                    "showtimes": ["11:00", "02:30", "06:00", "09:30"]  # temporary
                })

            return JsonResponse({
                "status": True,
                "data": data
            })

        except Exception as e:
            return JsonResponse({
                "status": False,
                "error": str(e)
            })
        


@csrf_exempt
def TheatrebyMovies(request, theatre_id):

    movies = tbl_movie.objects.filter(
        tbl_shows__screen_id__theater_id=theatre_id
    ).distinct()

    data = []

    for movie in movies:
        data.append({
            "movie_id": movie.id,
            "movie_title": movie.movie_title,
            "movie_poster": movie.movie_poster.url if movie.movie_poster else None
        })

    return JsonResponse({
        "status": True,
        "data": data
    })



@csrf_exempt
def Search(request, key):

    movies = tbl_movie.objects.filter(movie_title__icontains=key)
    theatres = tbl_theater.objects.filter(theater_name__icontains=key)
    cities = tbl_city.objects.filter(city_name__icontains=key)

    data = []

    for m in movies:
       data.append({
             "type": "Movie",
             "name": m.movie_title,
             "link": f"/user/movie/{m.id}"
          })
    for t in theatres:
        data.append({
            "type": "Theatre",
            "name": t.theater_name,
            "link": f"/TheatreView/movies/{t.id}"
        })

    for c in cities:
        data.append({
            "type": "City",
            "name": c.city_name,
            "link": f"/city/{c.id}"
        })

    return JsonResponse({
        "status": True,
        "data": data
    })


@csrf_exempt
def CancelBooking(request):

    if request.method == "POST":

        data = json.loads(request.body)
        booking_id = data.get("booking_id")

        try:

            booking = tbl_booking.objects.get(id=booking_id)

            # already cancelled
            if booking.booking_status == 2:
                return JsonResponse({
                    "msg": "Booking already cancelled"
                }, status=400)

            # change booking status
            booking.booking_status = 2
            booking.save()

            # delete seat bookings (release seats)
            tbl_seatbooking.objects.filter(
                booking_id=booking
            ).delete()

            return JsonResponse({
                "msg": "Booking cancelled successfully"
            })

        except tbl_booking.DoesNotExist:

            return JsonResponse({
                "msg": "Booking not found"
            }, status=404)
        


@csrf_exempt
def UpcomingMovies(request):

    # ADD UPCOMING MOVIE
    if request.method == "POST":

        tbl_upcomingmovies.objects.create(

            upmovie_title=request.POST['upmovie_title'],
            upmovie_description=request.POST['upmovie_description'],
            upmovie_genre=request.POST['upmovie_genre'],
            upmovie_release_date=request.POST['upmovie_release_date'],
            upmovie_trailer=request.POST['upmovie_trailer'],
            upmovie_poster=request.FILES.get('upmovie_poster')

        )

        return JsonResponse({
            "msg": "Upcoming Movie Added Successfully"
        })

    # VIEW UPCOMING MOVIES
    else:

        movies = tbl_upcomingmovies.objects.all()

        data = []

        for m in movies:

            data.append({
                "id": m.id,
                "title": m.upmovie_title,
                "description": m.upmovie_description,
                "genre": m.upmovie_genre,
                "release_date": m.upmovie_release_date,
                "trailer": m.upmovie_trailer,
                "poster": m.upmovie_poster.url if m.upmovie_poster else ""
            })

        return JsonResponse({"data": data})
    
@csrf_exempt
def Complaint(request):

    if request.method == "POST":

        tbl_complaint.objects.create(

            user_id = tbl_user.objects.get(id=request.POST['user_id']),
            complaint_title = request.POST['complaint_title'],
            complaint_content = request.POST['complaint_content']

        )

        return JsonResponse({
            "msg": "Complaint Submitted Successfully"
        })

    else:

        data = list(tbl_complaint.objects.values(
            'id',
            'complaint_title',
            'complaint_content',
            'complaint_date',
            user_name = F('user_id__user_name')
        ))

        return JsonResponse({"data": data})