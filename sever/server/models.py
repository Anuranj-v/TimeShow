from django.db import models


class tbl_district(models.Model):
    district_name = models.CharField(max_length=30)


class tbl_city(models.Model):
    city_name = models.CharField(max_length=50)
    district_id = models.ForeignKey(tbl_district, on_delete=models.CASCADE)


class tbl_admin(models.Model):
    admin_name = models.CharField(max_length=30)
    admin_email = models.EmailField(max_length=50)
    admin_password = models.CharField(max_length=128)


class tbl_theater(models.Model):
    theater_name = models.CharField(max_length=50)
    theater_email = models.EmailField(max_length=50)
    theater_contact = models.CharField(max_length=15)
    theater_photo = models.FileField(upload_to='Assets/TheaterPhoto/')
    theater_proof =models.FileField(upload_to='Assets/TheaterProof/')
    theater_password = models.CharField(max_length=128)
    city_id = models.ForeignKey(tbl_city, on_delete=models.CASCADE)
    theater_status = models.IntegerField(default=0, null=True)  # 0 for pending, 1 for approved, 2 for rejected


class tbl_user(models.Model):
    user_name = models.CharField(max_length=50)
    user_email = models.EmailField(max_length=50)
    user_password = models.CharField(max_length=128)
    user_contact = models.CharField(max_length=15)
    city_id = models.ForeignKey(tbl_city, on_delete=models.CASCADE,null=True)

class tbl_genre(models.Model):
    genre_name = models.CharField(max_length=30)


class tbl_movie(models.Model):
    movie_title = models.CharField(max_length=100)
    movie_description = models.TextField()
    movie_duration = models.CharField(max_length=10)
    movie_language = models.CharField(max_length=30)
    movie_poster = models.FileField(upload_to='Assets/Movies/')
    movie_banner = models.FileField(upload_to='Assets/Movies/')
    movie_genre = models.CharField(max_length=50,null=True)
    movie_release_date = models.DateField(null=True, blank=True)
    movie_trailer = models.CharField(max_length=200, null=True, blank=True)
    movie_rating = models.CharField(max_length=10, null=True, blank=True)
    

class tbl_theatermovie(models.Model):
    theater_id = models.ForeignKey(tbl_theater, on_delete=models.CASCADE)
    movie_id = models.ForeignKey(tbl_movie, on_delete=models.CASCADE)

class tbl_trailer(models.Model):
    movie_id = models.ForeignKey(tbl_movie, on_delete=models.CASCADE)
    trailer_file = models.FileField(upload_to='Assets/Movies/')
    trailer_description = models.CharField(max_length=200)


class tbl_review(models.Model):
    user_id = models.ForeignKey(tbl_user, on_delete=models.CASCADE)
    movie_id = models.ForeignKey(tbl_movie, on_delete=models.CASCADE)
    review_content = models.TextField()
    review_datetime = models.DateTimeField(auto_now_add=True)
    review_rating = models.TextField()


class tbl_booking(models.Model):
    user_id = models.ForeignKey(tbl_user, on_delete=models.CASCADE)
    movie_id = models.ForeignKey(tbl_movie, on_delete=models.CASCADE)
    booking_time = models.TimeField()
    booking_date = models.DateField(auto_now_add=True)
    booking_todate = models.DateField()
    booking_amount = models.DecimalField(max_digits=8, decimal_places=2)
    booking_status = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True,null=True)   # ⭐ ADD THIS
    


class tbl_screentype(models.Model):
    screentype_name = models.CharField(max_length=50)


class tbl_screen(models.Model):
    theater_id = models.ForeignKey(tbl_theater, on_delete=models.CASCADE)
    screentype_id = models.ForeignKey(tbl_screentype, on_delete=models.CASCADE)
    screen_seatno = models.CharField(max_length=50)
    Screen_name = models.CharField(max_length=50)

class tbl_seattype(models.Model):
    seattype_name = models.CharField(max_length=50)

class tbl_shows(models.Model):
    screen_id = models.ForeignKey(tbl_screen, on_delete=models.CASCADE)
    movie_id = models.ForeignKey(tbl_movie, on_delete=models.CASCADE)
    showtime= models.TimeField()
    showdate = models.DateField(null=True)


class tbl_complaint(models.Model):
    user_id = models.ForeignKey(tbl_user, on_delete=models.CASCADE)
    complaint_title = models.CharField(max_length=100)
    complaint_content = models.TextField()
    complaint_reply = models.TextField(blank=True)
    theater_id = models.ForeignKey(tbl_theater, on_delete=models.CASCADE)
    complaint_date = models.DateField(auto_now_add=True)

class tbl_screenseat(models.Model):
    screen_id = models.ForeignKey(tbl_screen, on_delete=models.CASCADE)
    seattype_id = models.ForeignKey(tbl_seattype, on_delete=models.CASCADE)

    rows = models.IntegerField()
    columns = models.IntegerField()
    aisles = models.CharField(max_length=100, blank=True, null=True)

    screenseat_total = models.IntegerField()
    screenseat_amountper = models.IntegerField()

class tbl_seatbooking(models.Model):
    booking_id = models.ForeignKey(tbl_booking, on_delete=models.CASCADE)
    screenseat_id = models.ForeignKey(tbl_screenseat, on_delete=models.CASCADE)
    seatbooking_number = models.CharField(max_length=10)

class tbl_feedback(models.Model):
    user_id = models.ForeignKey(tbl_user, on_delete=models.CASCADE)
    feedback_content = models.TextField()
    feedback_date = models.DateField(auto_now_add=True)    

class tbl_upcomingmovies(models.Model):
    upmovie_title = models.CharField(max_length=100)
    upmovie_description = models.TextField()
    upmovie_genre = models.CharField(max_length=50)
    upmovie_release_date = models.DateField()
    upmovie_trailer = models.CharField(max_length=255)
    upmovie_poster = models.FileField(upload_to='upcoming/poster/')